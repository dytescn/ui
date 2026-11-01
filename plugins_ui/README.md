# plugins_ui

Piksel 的插件管理界面，`web` 包，包名 `plugins`，当前版本 **1.0.9**。

## 作用

- 插件列表、分类、标签
- 插件配置与版本查看
- 更新检查与安装入口（配合 `plugin_lib`）

## 产物

`dytes.json` 的 `exports`：

| 文件 | 说明 |
| --- | --- |
| `plugins.js` | 页面脚本（`assets/project_app_0_0_1.js`） |
| `setup.ts` | 安装 / 更新时执行的路由初始化脚本 |

## 开发

```bash
deno task view     # 本地预览
deno task pack     # 打包（入口 src/app.ts）
```

## 文档

- [src/apis/plugins.md](src/apis/plugins.md) —— 插件、分类、版本、配置的数据结构
- [todo/ui-upgrade.md](todo/ui-upgrade.md) —— 依赖映射与打包入口待办
