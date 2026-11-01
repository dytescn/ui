/// init 默认加载 pages 与 stylesheet 产出的资源。
/// 资源清单集中在这里，app.ts 只调用 load_default_assets()。
export const DEFAULT_SCRIPTS = [
  "/pages/browser.js",
  "/pages/router.js",
] as const;

export const DEFAULT_STYLES = [
  "/stylesheet/funxui.css",
  "/stylesheet/funxicon.css",
  "/stylesheet/chat.css",
] as const;

function load_script(src: string, callback?: () => void): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      callback?.();
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.type = "module";
    script.src = src;
    script.onload = () => {
      callback?.();
      resolve();
    };
    script.onerror = () => reject(new Error(`JS 加载失败: ${src}`));
    document.head.appendChild(script);
  });
}

function load_style(href: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`link[href="${href}"]`)) {
      resolve();
      return;
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`CSS 加载失败: ${href}`));
    document.head.appendChild(link);
  });
}

/// 先按顺序加载 pages JS，再并行加载 stylesheet CSS。
/// JS 失败会向上抛出；CSS 失败只记录日志，不阻断初始化。
export async function load_default_assets(): Promise<void> {
  for (const src of DEFAULT_SCRIPTS) {
    await load_script(src);
  }

  await Promise.all(
    DEFAULT_STYLES.map((href) =>
      load_style(href).catch((error) => {
        console.error(error);
      })
    ),
  );
}
