// src/view/tabs.ts
export const slidebar_btn_tips = `
<div class="slidebar-context-menu bg-background border border-border rounded-md shadow-lg py-1 min-w-[120px] z-50">
  <button class="flex w-full items-center px-3 py-1.5 pl-8 text-sm text-foreground hover:bg-muted gap-x-1" data-action="pin">
    &nbsp;&nbsp;<%= it.is_pinned ? '取消置顶' : '置顶' %>
  </button>
  <button class="flex w-full items-center px-3 py-1.5 pl-8 text-sm text-foreground hover:bg-muted gap-x-1" data-action="archive">
    &nbsp;&nbsp;<%= it.is_archived ? '取消归档' : '归档' %>
  </button>
</div>
`;