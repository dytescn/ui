// test/materialRelation.test.ts
import {
  insertMaterialFile,
  getMaterialFilesByPuid,
  getMaterialFilesByOuid,
  getMaterialFileList,
} from "../src/apis/material.ts";

import {
  insertMaterialVersion,
  getMaterialVersionsByPageUid,
  getMaterialVersionsByFuid,
} from "../src/apis/version.ts";

import {
  insertMaterialType,
  getMaterialTypeByName,
} from "../src/apis/type.ts";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function testRelation() {
  console.log("===== 素材关联查询测试 =====");

  // 准备关联数据
  const puid = "relation-puid-001";
  const ouid = "relation-ouid-001";
  const pageUid = "relation-page-001";
  const fuid = "relation-fuid-001";
  const typeName = "视频类型";

  // 1. 插入素材类型（用于关联）
  console.log("1. 插入素材类型...");
  await insertMaterialType({
    uuid: "type-relation-001",
    type_name: typeName,
    icon: "video-icon",
  });
  await sleep(100);

  // 2. 插入素材文件
  console.log("2. 插入素材文件（关联项目和组织）...");
  await insertMaterialFile({
    uuid: "file-relation-001",
    puid: puid,
    ouid: ouid,
    flow_uid: "flow-rel",
    type_uid: "type-relation-001",
    name: "关联测试文件",
    desc: "用于关联查询",
    cover: "rel-cover.jpg",
    create_by: "tester",
  });
  await sleep(100);

  // 3. 插入素材版本（关联 page_uid 和 fuid）
  console.log("3. 插入素材版本...");
  await insertMaterialVersion({
    uuid: "ver-relation-001",
    cover: "ver-rel.jpg",
    page_uid: pageUid,
    child_uid: "child-rel",
    soft_ver: "v3.0",
    name: "关联版本",
    logs: "关联测试",
    fuid: fuid,
    create_by: "tester",
  });
  await sleep(100);

  // 4. 测试按 puid 查询文件
  console.log("4. 按 puid 查询文件...");
  const filesByPuid = await getMaterialFilesByPuid(puid);
  console.log(`  找到 ${filesByPuid.length} 个文件，第一个:`, filesByPuid[0]);

  // 5. 测试按 ouid 查询文件
  console.log("5. 按 ouid 查询文件...");
  const filesByOuid = await getMaterialFilesByOuid(ouid);
  console.log(`  找到 ${filesByOuid.length} 个文件`);

  // 6. 测试按 page_uid 查询版本
  console.log("6. 按 page_uid 查询版本...");
  const versByPage = await getMaterialVersionsByPageUid(pageUid);
  console.log(`  找到 ${versByPage.length} 个版本，第一个:`, versByPage[0]);

  // 7. 测试按 fuid 查询版本
  console.log("7. 按 fuid 查询版本...");
  const versByFuid = await getMaterialVersionsByFuid(fuid);
  console.log(`  找到 ${versByFuid.length} 个版本`);

  // 8. 测试按类型名称查询（跨表）
  console.log("8. 按类型名称查询类型...");
  const types = await getMaterialTypeByName(typeName);
  console.log(`  找到 ${types.length} 个类型`);

  // 9. 清理：软删除所有关联记录（为保持干净，可选择删除，此处仅演示）
  console.log("9. 清理数据（软删除文件及其版本）...");
  // 注意：此处只示范，实际可调用删除函数，本例省略以避免误删

  console.log("===== 关联查询测试完成 =====\n");
}

testRelation().catch(console.error);