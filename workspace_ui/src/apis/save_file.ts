// src/apis/save_file.ts
// 设计保存：编排已收口到 workspace_lib 的 save_design（内部调用
// sysinfo / cdrimex / ostfil / database），页面只负责传参。
import { callLib } from "./lib.ts";

export interface DesignInfo {
  filePath: string;
  puid: string | null;
  uuid: string | null;
}

/** 读取当前 CorelDRAW 文档路径（仅用于页面展示与参数推断）。 */
export async function getCurrentDesignInfo(ver: string = "26"): Promise<DesignInfo> {
  const res = await fetch("http://127.0.0.1:44944/cdrimex", {
    method: "POST",
    headers: {
      "Content-Type": "application/libary",
      "FFI-Symbol": "current_file_path",
    },
    body: JSON.stringify({ ver }),
  });
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const json = await res.json();

  const filePath: string | null =
    json?.code === 200 && json?.data?.file_path !== undefined
      ? json.data.file_path
      : json?.data?.path ?? json?.file_path ?? json?.path ?? null;

  if (!filePath) return { filePath: "", puid: null, uuid: null };
  if (filePath.includes("workspace\\versions") || filePath.includes("workspace/versions")) {
    return { filePath: "", puid: null, uuid: null };
  }

  const parts = filePath.split(/[\\/]/);
  const fileName = parts[parts.length - 1] || "";
  const baseName = fileName.includes(".") ? fileName.slice(0, fileName.lastIndexOf(".")) : fileName;
  const idx = baseName.indexOf("_");
  if (idx === -1) return { filePath, puid: null, uuid: null };

  const puid = baseName.slice(0, idx);
  const uuid = baseName.slice(idx + 1);
  if (!puid || !uuid) return { filePath, puid: null, uuid: null };
  return { filePath, puid, uuid };
}

export interface SaveToWorkspaceOptions {
  projectUid: string;
  fileName?: string;
  puid?: string;
  uuid?: string;
  ver?: string;
}

/** 保存当前设计到工作区：导出主文件、封面、版本，并经 ostfil 归档。 */
export async function saveCurrentDesignToWorkspace(
  options: SaveToWorkspaceOptions,
): Promise<any> {
  const data = await callLib("save_design", {
    project_uid: options.projectUid,
    file_name: options.fileName,
    puid: options.puid,
    uuid: options.uuid,
    ver: options.ver ?? "26",
  });
  return data.data;
}

/** 兼容旧调用：只保存当前文档（必须提供 project_uid 时才有意义）。 */
export async function do_save_file(options: {
  filePath?: string;
  puid?: string | null;
  uuid?: string | null;
  projectUid?: string;
}) {
  if (!options.projectUid) {
    throw new Error("do_save_file 需要 projectUid，请改用 saveCurrentDesignToWorkspace");
  }
  return await saveCurrentDesignToWorkspace({
    projectUid: options.projectUid,
    puid: options.puid ?? undefined,
    uuid: options.uuid ?? undefined,
  });
}
