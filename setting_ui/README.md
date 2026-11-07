# setting_ui

Piksel 的系统与设计设置界面，`web` 包，包名 `setting`，当前版本 **1.0.10**。

## 作用

- 基础设置与分类（通过 `info_lib` 读写 `info.db`）
- 设计软件相关设置
- 设置项编辑与保存

## 产物

`dytes.json` 的 `exports`：

| 文件 | 说明 |
| --- | --- |
| `info.js` | 基础设置页（`assets/project_info_1_0_9.js`） |
| `base.css` | 页面样式（`assets/project_base_1_0_9.css`） |
| `setup.json` | 安装 / 更新时执行的路由与默认值初始化请求 |

依赖：`info_lib 0.1.1`。

## 开发

```bash
deno task view     # 本地预览
deno task pack     # 打包（入口 pack.ts）
```

## 文档

- [todo/ui-upgrade.md](todo/ui-upgrade.md) —— 升级进度、设置表迁移与待办
