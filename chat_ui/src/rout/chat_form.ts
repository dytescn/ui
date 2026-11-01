// rout/chat_form.ts
import { chat_form_tpl } from "../view/chat_form.ts";
import { pickAndStoreFile, type Attachment } from "../apis/attachments.ts";
import { sendMessage } from "../apis/cloud.ts";
import { appendMessage } from "./render_msg.ts";
import { initChatInput } from "../utils/input_watch.ts";
import { init_slidebar } from "./slidebar.ts";
import type { Tpl } from "@funxdata/pages/tplstype";

// deno-lint-ignore no-explicit-any
const TplToHtml = (globalThis as any)["TplToHtml"] as Tpl;

/**
 * 初始化聊天输入框。
 * 会话创建、消息入库、模型调用全部由 chatllm 的 chat 接口完成。
 */
export const chat_form_init = (uid: string = "") => {
  const footer = document.querySelector("#chat-footer") as HTMLElement;
  if (!footer) return console.warn("[chat_form] #chat-footer 不存在");
  footer.innerHTML = TplToHtml.renderString(chat_form_tpl, { uid });

  // ---------- 附件：sysinfo.choose_file + ostfil.storage（SSE） ----------
  const attachments: Attachment[] = [];
  const attachmentsNode = footer.querySelector(
    ".aui-composer-attachments",
  ) as HTMLElement | null;
  const addAttachmentBtn = footer.querySelector(
    ".aui-composer-add-attachment",
  ) as HTMLButtonElement | null;
  let pickingAttachment = false;

  const formatSize = (size: number): string => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / 1024 / 1024).toFixed(1)} MB`;
  };

  const renderAttachments = () => {
    if (!attachmentsNode) return;
    attachmentsNode.innerHTML = "";
    attachments.forEach((item, index) => {
      const card = document.createElement("div");
      card.className =
        "aui-attachment-card flex items-center gap-2 rounded-lg border border-border/60 bg-background px-2.5 py-1.5 text-xs text-foreground";
      card.title = item.path;

      const icon = document.createElement("span");
      icon.textContent = "📄";

      const name = document.createElement("span");
      name.className = "max-w-40 truncate";
      name.textContent = item.name;

      const size = document.createElement("span");
      size.className = "text-muted-foreground";
      size.textContent = formatSize(item.size);

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "ml-1 text-muted-foreground hover:text-foreground";
      remove.setAttribute("aria-label", "移除附件");
      remove.textContent = "×";
      remove.addEventListener("click", () => {
        attachments.splice(index, 1);
        renderAttachments();
      });

      card.append(icon, name, size, remove);
      attachmentsNode.appendChild(card);
    });
  };

  if (addAttachmentBtn) {
    addAttachmentBtn.addEventListener("click", async () => {
      if (pickingAttachment) return;
      pickingAttachment = true;
      addAttachmentBtn.disabled = true;
      try {
        const item = await pickAndStoreFile();
        if (item) {
          attachments.push(item);
          renderAttachments();
        }
      } catch (err) {
        console.error("[chat_form] 选择附件失败:", err);
        const msg = err instanceof Error ? err.message : String(err);
        alert(`选择附件失败：${msg || "未知错误"}`);
      } finally {
        pickingAttachment = false;
        addAttachmentBtn.disabled = false;
      }
    });
  }

  const isFirstSend = !uid;

  /** 插件缺失类错误统一提示“插件为空”，不暴露底层 dlopen 细节。 */
  const describeSendError = (err: unknown): string => {
    const raw = err instanceof Error ? err.message : String(err);
    if (
      /libsiliconflow|siliconflow chat failed|加载 .*\.dll 失败|Plugin Not Found|插件/i
        .test(raw)
    ) {
      return "插件为空，请先安装或选择聊天插件";
    }
    return `发送失败：${raw || "未知错误，请检查 chatllm / 模型配置"}`;
  };

  /** 首次发送没有消息列表，在输入框上方显示错误。 */
  const showInlineError = (text: string) => {
    const footer = document.querySelector("#chat-footer");
    if (!footer) return;
    let node = document.getElementById("chat-send-error");
    if (!node) {
      node = document.createElement("div");
      node.id = "chat-send-error";
      node.className =
        "mx-4 mb-2 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700";
      footer.parentElement?.insertBefore(node, footer);
    }
    node.textContent = text;
  };

  const clearInlineError = () => {
    document.getElementById("chat-send-error")?.remove();
  };

  const handleSend = async (text: string) => {
    clearInlineError();
    // 首次发送：chatllm 自动新建对话，成功后跳转到该对话。
    if (!uid) {
      const reply = await sendMessage("", text, { title: text.slice(0, 30) });
      location.href = `/chat?uid=${reply.uuid}`;
      return;
    }

    // 续聊：先把用户消息放进 DOM，再等 chatllm 返回 assistant 回复。
    appendMessage({
      role: "user",
      content: text,
      html: undefined,
      messageId: `local-user-${Date.now()}`,
    });

    const reply = await sendMessage(uid, text);

    appendMessage({
      role: "assistant",
      content: reply.content,
      html: reply.content_html,
      messageId: `local-assistant-${Date.now()}`,
    });

    init_slidebar(uid);
  };

  initChatInput(footer, {
    onSend: async (text) => {
      try {
        await handleSend(text);
      } catch (err) {
        console.error("[chat_form] 发送失败，详细错误:", err);
        const errorMsg = describeSendError(err);
        if (isFirstSend) {
          showInlineError(errorMsg);
        } else {
          appendMessage({
            role: "assistant",
            content: errorMsg,
            messageId: "error-" + Date.now(),
          });
        }
        throw err;
      }
    },
  });
};
