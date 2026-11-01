// designsoft.ts
// 软件管理 API 封装

const BASE_URL = "http://127.0.0.1:44944";
const PATH = "designsoft";

// ============ 底层请求函数 ============
// deno-lint-ignore no-explicit-any
const designsoftRequest = async (symbol: string, body: any) => {
  const url = `${BASE_URL}/${PATH}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/libary",
      "FFI-Symbol": symbol,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`DesignSoft API error (${response.status}): ${errorText}`);
  }

  return response.json();
};

// ============ 类型定义 ============

export interface SoftwareItem {
  name: string;
  version: string;
  major_version?: string;   // 新增
  minor_version?: string;   // 新增
  install_path?: string;    // 新增
  publisher?: string;
  exe_path?: string;
}

export interface ApiResponse<T = unknown> {
  code: number;
  msg: string;
  data: T;
}

export interface InfoResponseData {
  list: SoftwareItem[];
}

export interface StatusResponseData {
  status: "未安装" | "已安装但未启动" | "已启动";
}

export interface StartResponseData {
  message: string;
}

// ============ 公开 API 函数 ============

// deno-lint-ignore require-await
export const getSoftwareInfo = async (keyword: string): Promise<ApiResponse<InfoResponseData>> => {
  return designsoftRequest("info", { keyword });
};

// deno-lint-ignore require-await
export const getSoftwareStatus = async (
  keyword: string,
  version?: string
): Promise<ApiResponse<StatusResponseData>> => {
  const body: { keyword: string; version?: string } = { keyword };
  if (version !== undefined) {
    body.version = version;
  }
  return designsoftRequest("status", body);
};

// deno-lint-ignore require-await
export const startSoftware = async (
  keyword: string,
  version?: string
): Promise<ApiResponse<StartResponseData>> => {
  const body: { keyword: string; version?: string } = { keyword };
  if (version !== undefined) {
    body.version = version;
  }
  return designsoftRequest("start", body);
};