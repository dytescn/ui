# init UI 升级

- [ ] IU-01 修正 `deno.json` 的 `@funxdata/toolkit` 映射：
  `jsr:@funxdata/toolkit@^0.1.36`（当前指向不存在的 `@funxdata/funxdata`）。
- [ ] IU-02 给 `pack` task 传入入口（如 `src/app.ts`），或让 web-tkit 自动发现入口。
- [ ] IU-03 用 `deno task pack assets/css/base.css` 生成 Tailwind 产物，并更新 `dytes.json` 的 CSS 导出。
- [ ] IU-04 统一 `deno.json` 的 `version` 与 `dytes.json` 的版本（当前 0.0.1 vs 1.0.17），避免产物名固定为 `*_0_0_1`。
- [ ] IU-05 验证 `deno task view` 与初始化向导页面。
