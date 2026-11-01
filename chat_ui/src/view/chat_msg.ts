export const chat_msg_tpl = `
<div id="chat-content-list-all" class="mb-14 flex flex-col gap-y-6 empty:hidden">
</div>
`;

// view/chat_msg.ts

// 用户消息模板
export const user_msg_tpl = `
<div
  data-slot="aui_user-message-root"
  data-role="user"
  class="fade-in slide-in-from-bottom-1 animate-in mx-auto grid w-full max-w-(--thread-max-width) auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] content-start gap-y-2 px-2 duration-150 [&:where(>*)]:col-start-2"
  data-message-id="<%= it.messageId %>"  
>
  <div class="aui-user-message-attachments-end"></div>
  <div class="aui-user-message-content-wrapper relative col-start-2 min-w-0">
    <div class="aui-user-message-content peer bg-muted text-foreground rounded-xl px-4 py-2 wrap-break-word empty:hidden">
      <%~ it.content %> 
    </div>
    <div class="aui-user-action-bar-wrapper"></div>
  </div>
</div>
`;

// 助手消息模板
export const assistant_msg_tpl = `
<div
  data-slot="aui_assistant-message-root"
  data-role="assistant"
  class="fade-in slide-in-from-bottom-1 animate-in relative mx-auto w-full max-w-(--thread-max-width) duration-150"
  data-message-id="<%= it.messageId %>"  
>
  <div data-slot="aui_assistant-message-content" class="text-foreground px-2 leading-relaxed wrap-break-word">
    <div data-status="complete" class="aui-md">
      <%~ it.content %>  
    </div>
  </div>
  <div data-slot="aui_assistant-message-footer" class="ml-2 flex items-center -mb-7.5 min-h-7.5 pt-1.5">
    <div class="aui-assistant-action-bar-root">
      <button type="button" data-slot="message-timing-trigger">
        <%= it.duration || '' %>  
      </button>
    </div>
  </div>
</div>
`;