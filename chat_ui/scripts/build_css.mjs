// scripts/build_css.mjs
// 按需构建聊天模块样式：Tailwind 扫描 src/ + index.html，产出 assets/css/chat.css。
// 用法：node scripts/build_css.mjs [--watch]
import fs from "node:fs";
import path from "node:path";
import postcss from "postcss";
import tailwindcss from "@tailwindcss/postcss";
import * as esbuild from "esbuild";

const root = path.resolve(import.meta.dirname, "..");
const input = path.join(root, "src/styles/app.css");
const legacy = path.join(root, "src/styles/legacy.css");
const output = path.join(root, "assets/css/chat.css");

const SIZE_LIMIT = 60 * 1024;

const build = async () => {
  const source = fs.readFileSync(input, "utf8");
  const compiled = await postcss([tailwindcss()]).process(source, { from: input });

  // legacy.css 是聊天模块原有样式（#chat-container 变量、动画、冲突修复），
  // 必须位于 Tailwind 产物之后且保持无层，才能继续覆盖主框架的同名工具类。
  const merged = `${compiled.css}\n${fs.readFileSync(legacy, "utf8")}`;
  const result = await esbuild.transform(merged, { loader: "css", minify: true });

  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, result.code);

  const bytes = Buffer.byteLength(result.code);
  const kb = (bytes / 1024).toFixed(1);
  console.log(`[build:css] ${path.relative(root, output)} ${kb} KB`);
  if (bytes > SIZE_LIMIT) {
    console.error(`[build:css] 体积超过阈值 ${SIZE_LIMIT / 1024} KB`);
    process.exitCode = 1;
  }
};

if (process.argv.includes("--watch")) {
  await build();
  let timer = null;
  const rebuild = (_event, file) => {
    if (file && !/\.(ts|css|html)$/.test(String(file))) return;
    clearTimeout(timer);
    timer = setTimeout(() => {
      build().catch((err) => console.error("[build:css]", err));
    }, 60);
  };
  // 只监听源码与入口，避免监听 node_modules / 输出目录造成循环构建。
  fs.watch(path.join(root, "src"), { recursive: true }, rebuild);
  fs.watch(path.join(root, "index.html"), rebuild);
  console.log("[build:css] watching src/ ...");
} else {
  await build();
}
