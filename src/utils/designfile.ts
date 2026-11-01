// src/utils/designfile.ts

interface DesignInfo {
  filePath: string;
  puid: string | null;
  uuid: string | null;
}

export async function getCurrentDesignInfo(): Promise<DesignInfo> {
  const url = "http://127.0.0.1:44944/cdrimex";
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/libary",
      "FFI-Symbol": "current_file_path",
    },
    body: JSON.stringify({ ver: "26" }), // ver 可能需要传递，用户测试中传了
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  const json = await res.json();
  // 尝试多种响应结构
  let filePath: string | null = null;
  if (json.code === 200 && json.data && json.data.file_path) {
    filePath = json.data.file_path;
  } else if (json.data && json.data.file_path) {
    filePath = json.data.file_path;
  } else if (json.file_path) {
    filePath = json.file_path;
  } else {
    // 无法获取
    throw new Error("无法解析文件路径响应");
  }

  // 如果 filePath 为空字符串或 null，视为新文件
  if (!filePath) {
    return { filePath: "", puid: null, uuid: null };
  }

  // 提取文件名
  const parts = filePath.split(/[\\\/]/);
  const fileName = parts[parts.length - 1] || "";
  if (!fileName) {
    return { filePath, puid: null, uuid: null };
  }

  // 去掉扩展名
  const dotIndex = fileName.lastIndexOf(".");
  const baseName = dotIndex > 0 ? fileName.substring(0, dotIndex) : fileName;

  // 按下划线分割
  const underscoreIndex = baseName.indexOf("_");
  if (underscoreIndex === -1) {
    // 没有下划线
    return { filePath, puid: null, uuid: null };
  }

  const puid = baseName.substring(0, underscoreIndex);
  const uuid = baseName.substring(underscoreIndex + 1);
  // 如果 puid 或 uuid 为空，也视为无效
  if (!puid || !uuid) {
    return { filePath, puid: null, uuid: null };
  }

  return { filePath, puid, uuid };
}