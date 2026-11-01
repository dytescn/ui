export const app_tpl = `
<div id="chat-container" class="bg-muted/30 flex h-full w-full">
   <div id="chat-slidebar" class="flex h-full flex-col overflow-hidden transition-all duration-200 w-65">
      <!-- search -->
       <div class="mt-2 flex h-12 shrink-0 items-center transition-[padding] duration-200 px-6">
         <div class="vg-searchs searchs-size-sm">
            <div class="search-icons">
            <i class="vg-icon ic-search"></i>
            </div>
            <input placeholder="搜索" id="search_chat">
         </div>
      </div>
      <div class="mt-2 flex h-12 shrink-0 items-center transition-[padding] duration-200 px-6">
             <span class="text-foreground/90 ml-2 text-sm font-medium whitespace-nowrap transition-opacity duration-200">对话列表</span>
        </div>
        <div class="chat-slidebar-info flex-1 min-h-0 overflow-y-auto p-3"></div>
   </div>
   <div id="chat-main" class="flex flex-1 flex-col overflow-hidden p-2 md:pl-0">
      <div class="bg-background flex flex-1 flex-col overflow-hidden rounded-lg">
         <div id="chat-header" class="flex h-12 shrink-0 items-center gap-2 px-4"></div>
         
         <% if (it.uid) { %>
         <!-- 消息滚动区域 -->
         <div id="chat-scroll-area" class="flex-1 min-h-0 overflow-y-auto px-4 pt-4 pb-8" style="padding-bottom:80px;">
            <div id="chat-content" class="flex flex-col gap-y-6"></div>
         </div>
         <% } %>

         <div id="chat-footer" class="shrink-0 px-4 pt-2 <%= it.uid ? 'pb-6' : 'pb-10 mt-auto' %>"></div>
      </div>
   </div>
</div>
`;