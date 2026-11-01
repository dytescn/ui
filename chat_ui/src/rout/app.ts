
import { app_tpl } from "../view/app.ts";
import type { Tpl } from "@funxdata/pages/tplstype";
// deno-lint-ignore no-explicit-any
const TplToHtml = (globalThis as any)["TplToHtml"] as Tpl;

export const app_init = (uuid:string) =>{

    const app_node = document.getElementById("app") as HTMLElement;
    app_node.innerHTML = TplToHtml.renderString(app_tpl, {uid:uuid});

}