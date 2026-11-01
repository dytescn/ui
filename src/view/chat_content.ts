// view/chat_msg.ts
export const chat_msg_tpl = `
<div data-slot="aui_message-group" class="mb-14 flex flex-col gap-y-6 empty:hidden">
  \${messages}
</div>
`;

export const user_msg_tpl = `
<div
  data-slot="aui_user-message-root"
  data-role="user"
  class="fade-in slide-in-from-bottom-1 animate-in mx-auto grid w-full max-w-(--thread-max-width) auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] content-start gap-y-2 px-2 duration-150 [&:where(>*)]:col-start-2"
  data-message-id="\${messageId}"
>
  <div
    class="aui-user-message-attachments-end col-span-full col-start-1 row-start-1 flex w-full flex-row justify-end gap-2"
  ></div>
  <div class="aui-user-message-content-wrapper relative col-start-2 min-w-0">
    <div
      class="aui-user-message-content peer bg-muted text-foreground rounded-xl px-4 py-2 wrap-break-word empty:hidden"
    >
      \${content}
    </div>
    <div
      class="aui-user-action-bar-wrapper absolute top-1/2 left-0 -translate-x-full -translate-y-1/2 pr-2 peer-empty:hidden"
    ></div>
  </div>
</div>
`;

export const assistant_msg_tpl = `
<div
  data-slot="aui_assistant-message-root"
  data-role="assistant"
  class="fade-in slide-in-from-bottom-1 animate-in relative mx-auto w-full max-w-(--thread-max-width) duration-150"
  data-message-id="\${messageId}"
>
  <div
    data-slot="aui_assistant-message-content"
    class="text-foreground px-2 leading-relaxed wrap-break-word"
  >
    <div data-status="complete" class="aui-md">
      \${content}
    </div>
  </div>
  <div
    data-slot="aui_assistant-message-footer"
    class="ml-2 flex items-center -mb-7.5 min-h-7.5 pt-1.5"
  >
    <div
      class="aui-assistant-action-bar-root text-muted-foreground animate-in fade-in col-start-3 row-start-2 -ml-1 flex gap-1 duration-200"
    >
      <button
        data-slot="tooltip-trigger"
        data-variant="ghost"
        data-size="icon"
        class="focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 aui-button-icon size-6 p-1 active:scale-90"
        type="button"
        data-state="closed"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy animate-in zoom-in-75 fade-in duration-150" aria-hidden="true">
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
        </svg>
        <span class="aui-sr-only sr-only">Copy</span>
      </button>
      <button
        data-slot="tooltip-trigger"
        data-variant="ghost"
        data-size="icon"
        class="focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 aui-button-icon size-6 p-1 active:scale-90"
        type="button"
        data-state="closed"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-refresh-cw" aria-hidden="true">
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
          <path d="M21 3v5h-5"></path>
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
          <path d="M8 16H3v5"></path>
        </svg>
        <span class="aui-sr-only sr-only">Refresh</span>
      </button>
      <button
        data-slot="tooltip-trigger"
        data-variant="ghost"
        data-size="icon"
        class="focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 aui-button-icon size-6 p-1 active:scale-90 data-[state=open]:bg-accent"
        type="button"
        aria-haspopup="menu"
        aria-expanded="false"
        data-state="closed"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ellipsis" aria-hidden="true">
          <circle cx="12" cy="12" r="1"></circle>
          <circle cx="19" cy="12" r="1"></circle>
          <circle cx="5" cy="12" r="1"></circle>
        </svg>
        <span class="aui-sr-only sr-only">More</span>
      </button>
      <button
        type="button"
        data-slot="message-timing-trigger"
        aria-label="Message timing"
        class="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center rounded-md p-1 font-mono text-xs tabular-nums transition-colors"
        data-state="closed"
      >
        \${duration}
      </button>
    </div>
  </div>
</div>
`;
