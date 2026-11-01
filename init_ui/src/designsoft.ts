import { setting_tpl } from "./view/setting.ts"
import { design_init } from "./rout/design.ts"

const app_node =document.getElementById("app") as HTMLElement;
app_node.innerHTML = setting_tpl;

await design_init();