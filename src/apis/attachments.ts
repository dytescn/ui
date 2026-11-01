// src/apis/attachments.ts
// Pick a file via sysinfo.choose_file and store it in ostfil, both over SSE.
import { buildSseUrl, fetchEventSource } from "@funxdata/webdx/dxsse";

const BASE_URL = "http://127.0.0.1:44944";

export interface Attachment {
  uuid: string;
  name: string;
  path: string;
  size: number;
  extra: string;
}

interface SseCallOptions {
  timeoutMs?: number;
}

function basename(path: string): string {
  const parts = path.split(/[\\/]/);
  return parts[parts.length - 1] || path;
}

async function callSse<T>(
  query: { lib: string; symbol: string; [key: string]: unknown },
  options: SseCallOptions = {},
): Promise<T> {
  const controller = new AbortController();
  const timeoutMs = options.timeoutMs ?? 15000;
  const url = buildSseUrl(BASE_URL, query);

  return await new Promise<T>((resolve, reject) => {
    let settled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const finish = (fn: () => void) => {
      if (settled) return;
      settled = true;
      if (timer !== null) clearTimeout(timer);
      controller.abort();
      fn();
    };

    timer = setTimeout(() => {
      finish(() => reject(new Error("SSE 请求超时")));
    }, timeoutMs);

    void fetchEventSource(url, {
      method: "GET",
      signal: controller.signal,
      openWhenHidden: true,
      onmessage: (ev) => {
        if (!ev.data) return;
        try {
          const payload = JSON.parse(ev.data) as {
            code?: number;
            data?: T;
            msg?: string;
          };
          if (payload.code !== 200 && payload.code !== 0) {
            const msg = payload.msg ?? `SSE 调用失败 (code=${payload.code})`;
            finish(() => reject(new Error(msg)));
          } else {
            finish(() => resolve((payload.data ?? null) as T));
          }
        } catch (e) {
          finish(() => reject(e instanceof Error ? e : new Error(String(e))));
        }
      },
      onerror: () => null,
    }).catch((e) => {
      finish(() => reject(e instanceof Error ? e : new Error(String(e))));
    });
  });
}

export async function storeFile(path: string): Promise<Attachment> {
  const stored = await callSse<{
    uuid: string;
    size: number;
    extra: string;
  }>(
    {
      lib: "libostfil",
      symbol: "post_storage",
      args: { file_path: path },
      once: 1,
    },
    { timeoutMs: 30000 },
  );

  if (!stored?.uuid) throw new Error("ostfil 未返回 uuid");

  return {
    uuid: stored.uuid,
    name: basename(path),
    path,
    size: stored.size ?? 0,
    extra: stored.extra ?? "",
  };
}

/**
 * 弹出系统文件选择框，选择后通过 ostfil.storage 存储。
 * 返回 null 表示用户取消。
 */
export async function pickAndStoreFile(): Promise<Attachment | null> {
  const picked = await callSse<{ path: string | null }>(
    {
      lib: "sysinfo",
      symbol: "post_choose_file",
      once: 1,
    },
    { timeoutMs: 300000 },
  );

  if (!picked?.path) return null;
  return await storeFile(picked.path);
}
