# workspace_ui

Piksel 的工作区与项目界面，`web` 包，包名 `workspace`，当前版本 **1.0.6**。

## 作用

- 项目列表、项目详情与项目设置
- 工作区文件与设计文件
- 项目版本、版本日志与更新记录

## 产物

`dytes.json` 的 `exports`：

| 文件 | 说明 |
| --- | --- |
| `project.js` | 项目页（`assets/workspace_project_1_0_6.js`） |
| `workspace.js` | 工作区页（`assets/workspace_workspace_1_0_6.js`） |
| `setting.js` | 项目设置页（`assets/workspace_setting_1_0_6.js`） |
| `setup.json` | 安装 / 更新时执行的路由请求 |

依赖：`workspace_lib 1.0.1`、`info_lib 0.1.0`。

## 开发

```bash
deno task view     # 本地预览
deno task pack     # 打包
```

## 文档

- [src/apis/workspace.md](src/apis/workspace.md) —— 项目、版本、日志等表结构
- [todo/ui-upgrade.md](todo/ui-upgrade.md) —— 依赖映射与打包入口待办
