// tests/chatllm_api.test.ts
// 集成测试：需要先在 app/piksel 启动 cyctron（chatllm 已安装）。
// 运行：deno test --allow-net tests/chatllm_api.test.ts
import { getSessions } from "../src/apis/sessions.ts";
import { getMessagesBySessionWithLimit } from "../src/apis/messages.ts";

Deno.test("dialogue_list 返回会话数组", async () => {
  const list = await getSessions(false, 5, 0);
  if (!Array.isArray(list)) throw new Error("getSessions 未返回数组");
});

Deno.test("chat_detail 返回消息列表", async () => {
  const list = await getSessions(false, 1, 0);
  if (list.length === 0) return;
  const detail = await getMessagesBySessionWithLimit(list[0].id, 5);
  if (!Array.isArray(detail.list)) throw new Error("chat_detail 未返回 list");
});
