// storage.ts
// 文件存储 API 封装，支持上传、删除、获取文件信息

// 基础配置
const BASE_URL = "http://127.0.0.1:44944";
const PATH = "libostfil"; // 统一路径

// ============ 底层请求函数 ============
// deno-lint-ignore no-explicit-any
const storageRequest = async (symbol: string, body: any) => {
  const url = `${BASE_URL}/${PATH}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/libary", // 统一使用 libary
      "FFI-Symbol": symbol,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Storage API error (${response.status}): ${errorText}`);
  }

  return response.json();
};

// ============ 公开 API 函数 ============

/**
 * 上传文件（存储）
 * @param filePath 文件绝对路径
 * @returns 返回文件信息（uuid, size, md5 等）
 * @example
 * const result = await uploadFile("D:\\dayin\\video.mp4");
 * console.log(result.data.uuid);
 */
// deno-lint-ignore require-await
export const uploadFile = async (filePath: string) => {
  return storageRequest("storage", { file_path: filePath });
};

/**
 * 删除文件（通过 uuid）
 * @param uuid 文件唯一标识
 * @returns 删除结果
 * @example
 * await deleteFile("18eb8248-2f5f-490b-96d0-8f155e6f791b");
 */
// deno-lint-ignore require-await
export const deleteFile = async (uuid: string) => {
  return storageRequest("delete_file", { uuid });
};

/**
 * 获取文件信息（通过 uuid）
 * @param uuid 文件唯一标识
 * @returns 文件详细信息（size, extra, end_time 等）
 * @example
 * const info = await getFile("18eb8248-2f5f-490b-96d0-8f155e6f791b");
 * console.log(info.data.size);
 */
// deno-lint-ignore require-await
export const getFile = async (uuid: string) => {
  return storageRequest("get_fil", { uuid });
};