# init_ui

Piksel 的初始化与入口界面，`web` 包，包名 `init`，当前版本 **1.0.20**。

## 作用

- 读取 `info.db` 的 `routers` 表，注册路由并渲染侧边栏
- 加载 `pages` 与 `stylesheet`
- 设计软件选择与启动
- 根路径跳转到默认页面 `/chat`

## 产物

`dytes.json` 的 `exports`：

| 文件 | 说明 |
| --- | --- |
| `init.js` | 入口脚本（`assets/init_app_0_0_1.js`） |
| `setup.ts` | 安装 / 更新时执行的路由初始化脚本 |

依赖：`info_lib 0.1.0`、`pages 1.0.0`、`stylesheet 1.0.1`。

## 开发

```bash
deno task view     # 本地预览
deno task pack     # 打包
```

## 文档

- [src/apis/init.md](src/apis/init.md) —— 路由表与文件相关数据结构
- [todo/ui-upgrade.md](todo/ui-upgrade.md) —— 待修正的依赖映射与打包入口
