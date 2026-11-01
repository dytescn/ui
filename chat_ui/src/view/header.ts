export const header_tpl = `
<button data-slot="sheet-trigger" data-variant="ghost" data-size="icon" 
class="focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive 
aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 inline-flex items-center 
justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none 
focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none 
[&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 
hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 size-8 shrink-0 md:hidden" 
type="button" aria-haspopup="dialog" aria-expanded="false" data-state="closed">
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" 
fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
class="lucide lucide-menu size-4" aria-hidden="true"><path d="M4 5h16"></path>
<path d="M4 12h16"></path><path d="M4 19h16"></path>
</svg>
<span class="sr-only">Toggle menu</span>
</button>
<button data-slot="tooltip-trigger" 
    data-variant="ghost" data-size="icon" 
    class="focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive 
    aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 shrink-0 items-center 
    justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none 
    focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none 
    [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 hover:bg-accent hover:text-accent-foreground 
    dark:hover:bg-accent/50 aui-button-icon p-1 active:scale-90 hidden size-8 md:flex" data-state="closed">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
    class="lucide lucide-panel-left size-4" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="2"></rect>
    <path d="M9 3v18"></path>
    </svg>
    <span class="aui-sr-only sr-only">Hide sidebar</span>
</button>

<span id="chat-header-title" class="min-w-0 truncate text-sm font-medium cursor-pointer hover:bg-accent hover:text-accent-foreground rounded px-1 py-0.5 transition-colors" title="点击修改标题">
   <%= it.title %> 
</span>

<button id="chat-header-archive-btn" data-slot="tooltip-trigger" data-variant="ghost" data-size="icon" 
class="focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive 
aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 inline-flex shrink-0 items-center 
justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none 
focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none 
[&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 hover:bg-accent hover:text-accent-foreground 
dark:hover:bg-accent/50 aui-button-icon p-1 active:scale-90 ml-auto size-8" 
type="button" aria-label="归档对话" data-state="closed">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
    class="lucide lucide-archive size-4" aria-hidden="true">
        <rect width="20" height="5" x="2" y="3" rx="1"></rect>
        <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"></path>
        <path d="M10 12h4"></path>
    </svg>
    <span class="aui-sr-only sr-only">归档</span>
</button>
`;