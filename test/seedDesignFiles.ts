// test/seedDesignFiles.ts
import { insertDesignFile } from "../src/apis/designFiles.ts";

const projectUid = "331f67d5-0a5c-4c9e-84ac-2cd793263393";
const organUid = "org-demo";
const createBy = "seed-user";

// 模拟数据数组
const mockDesignFiles = [
  {
    uuid: "a1b2c3d4-0001-4000-8000-000000000001",
    project_uid: projectUid,
    organ_uid: organUid,
    flow_uid: "flow-001",
    type_uid: "type-web",
    name: "首页设计稿",
    description: "首页整体布局与视觉设计",
    create_by: createBy,
    cover: "https://example.com/covers/home.jpg",
  },
  {
    uuid: "a1b2c3d4-0002-4000-8000-000000000002",
    project_uid: projectUid,
    organ_uid: organUid,
    flow_uid: "flow-002",
    type_uid: "type-mobile",
    name: "移动端首页",
    description: "移动端首页适配设计",
    create_by: createBy,
    cover: "https://example.com/covers/mobile-home.jpg",
  },
  {
    uuid: "a1b2c3d4-0003-4000-8000-000000000003",
    project_uid: projectUid,
    organ_uid: organUid,
    flow_uid: "flow-003",
    type_uid: "type-component",
    name: "按钮组件库",
    description: "通用按钮组件设计",
    create_by: createBy,
    cover: "https://example.com/covers/buttons.jpg",
  },
  {
    uuid: "a1b2c3d4-0004-4000-8000-000000000004",
    project_uid: projectUid,
    organ_uid: organUid,
    flow_uid: "flow-004",
    type_uid: "type-web",
    name: "详情页设计",
    description: "产品详情页布局设计",
    create_by: createBy,
    cover: "https://example.com/covers/detail.jpg",
  },
  {
    uuid: "a1b2c3d4-0005-4000-8000-000000000005",
    project_uid: projectUid,
    organ_uid: organUid,
    flow_uid: "flow-005",
    type_uid: "type-web",
    name: "登录页设计",
    description: "登录/注册页面设计",
    create_by: createBy,
    cover: "https://example.com/covers/login.jpg",
  },
  {
    uuid: "a1b2c3d4-0006-4000-8000-000000000006",
    project_uid: projectUid,
    organ_uid: organUid,
    flow_uid: "flow-006",
    type_uid: "type-mobile",
    name: "移动端详情页",
    description: "移动端详情页设计",
    create_by: createBy,
    cover: "https://example.com/covers/mobile-detail.jpg",
  },
  {
    uuid: "a1b2c3d4-0007-4000-8000-000000000007",
    project_uid: projectUid,
    organ_uid: organUid,
    flow_uid: "flow-007",
    type_uid: "type-component",
    name: "表单组件",
    description: "表单输入控件设计",
    create_by: createBy,
    cover: "https://example.com/covers/forms.jpg",
  },
  {
    uuid: "a1b2c3d4-0008-4000-8000-000000000008",
    project_uid: projectUid,
    organ_uid: organUid,
    flow_uid: "flow-008",
    type_uid: "type-web",
    name: "个人中心页面",
    description: "用户个人中心布局设计",
    create_by: createBy,
    cover: "https://example.com/covers/profile.jpg",
  },
];

// 逐个插入
for (const data of mockDesignFiles) {
  const result = await insertDesignFile(data);
  console.log(`插入设计文件 ${data.name} 成功:`, result);
}

console.log("所有模拟数据插入完成！");