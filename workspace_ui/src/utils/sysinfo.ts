// src/utils/sysinfo.ts

// ---------- 类型定义 ----------
interface FFIResponse<T = any> {
  code: number;
  data: T;
  msg: string;
}

// ---------- 调用 FFI 接口 ----------
async function callFFI<T = any>(
  symbol: string,
  body: Record<string, unknown>
): Promise<FFIResponse<T>> {
  const res = await fetch("http://127.0.0.1:44944/sysinfo", {
    method: "POST",
    headers: {
      "Content-Type": "application/libary",
      "FFI-Symbol": symbol,
    },
    body: JSON.stringify(body),
  });
  return res.json();
}

/**
 * 获取当前工作目录的绝对路径
 * @returns 当前目录绝对路径
 * @throws {Error} 当 FFI 调用失败时抛出错误
 */
export async function getCurrentDir(): Promise<string> {
  const result = await callFFI<{ path: string }>("cur_dir", {});
  if (result.code !== 200) {
    throw new Error(`获取当前目录失败: ${result.msg}`);
  }
  return result.data.path;
}

/**
 * 确保当前目录下存在 workspace 目录，若不存在则创建。
 * @returns workspace 目录的绝对路径
 * @throws {Error} 当 FFI 调用失败时抛出错误
 */
export async function ensureWorkspace(): Promise<string> {
  const createRes = await callFFI<{ path: string }>("create_dir", {
    dir_name: "workspace",
  });
  if (createRes.code !== 200) {
    throw new Error(`创建/获取 workspace 目录失败: ${createRes.msg}`);
  }
  return createRes.data.path;
}