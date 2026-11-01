import { card_tpl } from "../view/card.ts";
import {
  getPlugins,
  installPlugin,
  scanPlugins,
  uninstallPlugin,
  type PluginRecord,
} from "../apis/plugins.ts";
import type { Tpl } from "@funxdata/pages/tplstype";
import {
  checkPluginUpdates,
  type PluginUpdate,
} from "../apis/update_check.ts";

const TplToHtml = (globalThis as any)["TplToHtml"] as Tpl;

let currentPlugins: PluginRecord[] = [];
let updateMap = new Map<string, PluginUpdate>();
let updatesChecked = false;

const showSettings = (plugin: PluginRecord) => {
  const popup = document.getElementById("popup");
  if (!popup) return;

  popup.innerHTML = `
    <div style="position:fixed;inset:0;background:rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;z-index:9999">
      <div style="background:#fff;border-radius:10px;padding:20px;min-width:320px;max-width:90vw">
        <h4 style="margin-bottom:12px">${plugin.name ?? plugin.uuid}</h4>
        <p>UUID：${plugin.uuid}</p>
        <p>状态：${plugin.installed ? "已安装" : "未安装"}</p>
        <p>路径：${plugin.install_path ?? "-"}</p>
        <p>启用：${plugin.enabled ? "是" : "否"}</p>
        <div style="margin-top:16px;text-align:right">
          <button class="vg-btn" data-action="close-settings">关闭</button>
        </div>
      </div>
    </div>`;

  popup
    .querySelector('[data-action="close-settings"]')
    ?.addEventListener("click", () => {
      popup.innerHTML = "";
    });
};

const bindActions = (node: HTMLElement, refresh: () => Promise<void>) => {
  node.querySelectorAll<HTMLElement>("[data-action]").forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();

      const uuid = button.dataset.uuid;
      const action = button.dataset.action;
      if (!uuid || !action) return;

      if (action === "settings") {
        const plugin = currentPlugins.find((item) => item.uuid === uuid);
        if (plugin) showSettings(plugin);
        return;
      }

      button.classList.add("disabled");
      try {
        if (action === "install") {
          await installPlugin(uuid);
        } else if (action === "uninstall") {
          await uninstallPlugin(uuid);
        }
        await refresh();
      } catch (error) {
        console.error(`${action} 插件失败:`, error);
        const tip = action === "install" ? "安装" : "卸载";
        alert(`${tip}失败: ${(error as Error).message}`);
        button.classList.remove("disabled");
      }
    });
  });
};

let scanned = false;

const ensureScanned = async () => {
  if (scanned) return;
  try {
    await scanPlugins();
    scanned = true;
  } catch {
    // 扫描失败时仍然尝试读取已有列表
  }
};

const ensureUpdates = async () => {
  if (updatesChecked) return;
  try {
    const result = await checkPluginUpdates();
    updateMap = new Map(result.updates.map((item) => [item.name, item]));
    updatesChecked = true;
  } catch {
    // 检查失败不影响列表展示
  }
};

const render = async (node: HTMLElement) => {
  await ensureScanned();
  await ensureUpdates();
  const { list } = await getPlugins();
  currentPlugins = (list ?? []).map((plugin) => {
    const update = updateMap.get(plugin.name ?? "");
    return {
      ...plugin,
      needs_update: update?.needs_update ?? false,
      remote_version: update?.remote_version,
    };
  });
  if (!list || list.length === 0) {
    node.innerHTML = "<p>暂无插件</p>";
    return;
  }

  node.innerHTML = "";
  const cards_html = await TplToHtml.renderString(card_tpl, { lists: currentPlugins });
  node.insertAdjacentHTML("beforeend", cards_html);
  bindActions(node, () => render(node));
};

export const plugins_list = async () => {
  const plugins_node = document.getElementById("all-cards-content");
  if (!plugins_node) return;

  try {
    await render(plugins_node as HTMLElement);
  } catch (error) {
    console.error("获取插件列表失败:", error);
    plugins_node.innerHTML = "<p>插件列表加载失败</p>";
  }
};
