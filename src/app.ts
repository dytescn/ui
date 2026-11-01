import { app_init } from "./route/app.ts";
import { plugins_list } from "./route/list.ts";
import { plugins_tags } from "./route/tags.ts";
app_init();
plugins_tags();
plugins_list();
