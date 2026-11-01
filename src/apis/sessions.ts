// src/apis/sessions.ts
// 会话（dialogue）操作，全部通过 chatllm 的 dialogue_* 接口完成。
import { callChatllm } from "./chatllm.ts";

export interface Dialogue {
  id: string;
  title: string;
  show_status?: number;
  message_count?: number;
  last_seq?: number;
  is_pinned: number;
  is_archived: number;
  created_at: string;
  updated_at: string;
}

interface PageResult<T> {
  list: T[];
  page: number;
  page_size: number;
  total: number;
}

/** 会话列表：chatllm 的 dialogue_list 只返回未归档会话。 */
export const getSessions = async (
  archived = false,
  limit = 15,
  offset = 0,
): Promise<Dialogue[]> => {
  if (archived) return [];
  const page = Math.floor(offset / limit) + 1;
  const data = await callChatllm<PageResult<Dialogue>>("dialogue_list", {
    page,
    page_size: limit,
  });
  return data.list ?? [];
};

/** 按 id 查找会话：chatllm 没有单条查询接口，分页遍历对话列表。 */
export const getSessionById = async (id: string): Promise<Dialogue | null> => {
  const pageSize = 100;
  let page = 1;
  while (true) {
    const data = await callChatllm<PageResult<Dialogue>>("dialogue_list", {
      page,
      page_size: pageSize,
    });
    const found = (data.list ?? []).find((s) => s.id === id);
    if (found) return found;
    if (page * pageSize >= (data.total ?? 0)) return null;
    page += 1;
  }
};

export const updateSession = async (
  id: string,
  updates: {
    title?: string;
    show_status?: number;
    is_pinned?: boolean;
    is_archived?: boolean;
  },
) => {
  const payload: Record<string, unknown> = { uuid: id };
  if (updates.title !== undefined) payload.title = updates.title;
  if (updates.show_status !== undefined) payload.show_status = updates.show_status;
  if (updates.is_pinned !== undefined) payload.is_pinned = updates.is_pinned ? 1 : 0;
  if (updates.is_archived !== undefined) payload.is_archived = updates.is_archived ? 1 : 0;

  await callChatllm("dialogue_update", payload);
};
