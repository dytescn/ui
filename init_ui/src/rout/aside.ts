import { asides_tpl } from "../view/asides.ts";
import { get_asides_info } from "../apis/route.ts";
import type { Tpl } from "@funxdata/pages/tplstype";

export const aside_init = async () => {
  // deno-lint-ignore no-explicit-any
  const TplToHtml = (globalThis as any)["TplToHtml"] as Tpl;
  const asides_info = await get_asides_info();
  console.log(asides_info);
  const aside_node = document.getElementById("asides") as HTMLElement;
  aside_node.innerHTML = await TplToHtml.renderString(asides_tpl, {
    "asides": asides_info,
  });
};
