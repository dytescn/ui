// utils/input_watch.ts

export interface ChatInputOptions {
  onSend: (text: string) => Promise<void> | void;
}

export function initChatInput(container: HTMLElement, options: ChatInputOptions) {
  const { onSend } = options;

  const form = container.querySelector(".aui-composer-root") as HTMLFormElement;
  const sendBtn = container.querySelector(".aui-composer-send") as HTMLButtonElement;
  const input = container.querySelector(".aui-lexical-input") as HTMLElement;
  const placeholder = container.querySelector(".aui-lexical-placeholder") as HTMLElement;

  if (!form || !sendBtn || !input) {
    console.warn("[input_watch] 必要的输入元素缺失");
    return;
  }

  // ---------- 内部工具函数 ----------
  const getText = () => input.innerText?.trim() || "";

  const updateSendButton = () => {
    sendBtn.disabled = getText().length === 0;
  };

  // 更新 placeholder：内容为空时淡入显示，输入后淡出（避免瞬间消失造成跳动）
  const updatePlaceholder = () => {
    if (!placeholder) return;
    placeholder.style.opacity = getText().length === 0 ? "1" : "0";
  };

  const clearInput = () => {
    // 保留一个可放置光标的空段落，避免清空后高度塌陷
    input.innerHTML = '<p dir="auto"><br></p>';
    input.focus();
    updateSendButton();
    updatePlaceholder();
  };

  let isSending = false;

  const send = async () => {
    if (isSending) return;
    const text = getText();
    if (!text) return;

    isSending = true;
    sendBtn.disabled = true;
    sendBtn.setAttribute("data-state", "sending");

    try {
      await onSend(text);
      clearInput();
    } catch (err) {
      console.error("[input_watch] 发送失败:", err);
    } finally {
      isSending = false;
      sendBtn.disabled = false;
      sendBtn.removeAttribute("data-state");
      updateSendButton();
      updatePlaceholder();
      input.focus();
    }
  };

  // ---------- 键盘事件 ----------
  input.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.isComposing) return;

    if (e.key === "Enter") {
      if (e.shiftKey) {
        return;
      }
      e.preventDefault();
      send();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      send();
    }
  });

  // ---------- 输入事件 ----------
  input.addEventListener("input", () => {
    updateSendButton();
    updatePlaceholder();
  });

  // ---------- 发送按钮点击 ----------
  sendBtn.addEventListener("click", () => {
    send();
  });

  // ---------- 表单提交 ----------
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    send();
  });

  // ---------- 焦点与失焦（不再切换 placeholder，统一由内容决定） ----------
  input.addEventListener("focus", () => {
    updatePlaceholder();
  });

  input.addEventListener("blur", () => {
    updatePlaceholder();
  });

  // ---------- 初始状态 ----------
  updateSendButton();
  updatePlaceholder();
  // 注意：移除自动聚焦，避免加载后 placeholder 消失
  // input.focus();
}