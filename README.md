# material_ui

Piksel 的素材库界面，`web` 包，包名 `material`，当前版本 **1.0.4**。

## 作用

- 素材文件、类型、版本的浏览与创建
- 标签与滚动加载
- 通过 `material_lib` 访问素材能力

## 产物

`dytes.json` 的 `exports`：

| 文件 | 说明 |
| --- | --- |
| `material.js` | 页面脚本（`assets/project_app_0_0_1.js`） |
| `setup.ts` | 安装 / 更新时执行的路由初始化脚本 |

依赖：`material_lib 1.0.1`、`info_lib 0.1.0`。

## 开发

```bash
deno task view     # 本地预览
deno task pack     # 打包
```

## 文档

- [src/apis/material.md](src/apis/material.md) —— 素材文件、类型、版本的数据结构
