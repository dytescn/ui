// test/materialError.test.ts
import {
  getMaterialFileById,
  updateMaterialFile,
  deleteMaterialFile,
  softDeleteMaterialFile,
} from "../src/apis/material.ts";

import {
  updateMaterialType,
  deleteMaterialType,
} from "../src/apis/type.ts";

import {
  updateMaterialVersion,
  deleteMaterialVersion,
} from "../src/apis/version.ts";

async function testErrors() {
  console.log("===== 素材错误处理测试 =====");

  const nonExistId = 999999;

  // 1. 查询不存在的记录
  console.log("1. 查询不存在的素材文件 (id=999999)...");
  try {
    const res = await getMaterialFileById(nonExistId);
    console.log("  返回结果:", res); // 应为 null
  } catch (e) {
    console.error("  查询异常:", e);
  }

  // 2. 更新不存在的记录
  console.log("2. 尝试更新不存在的素材文件...");
  try {
    const res = await updateMaterialFile(nonExistId, { name: "test" });
    console.log("  更新结果:", res); // 可能返回错误或成功但影响0行
  } catch (e) {
    console.error("  更新异常:", e);
  }

  // 3. 软删除不存在的记录
  console.log("3. 尝试软删除不存在的素材文件...");
  try {
    const res = await softDeleteMaterialFile(nonExistId);
    console.log("  软删除结果:", res);
  } catch (e) {
    console.error("  软删除异常:", e);
  }

  // 4. 物理删除不存在的记录
  console.log("4. 尝试物理删除不存在的素材文件...");
  try {
    const res = await deleteMaterialFile(nonExistId);
    console.log("  物理删除结果:", res);
  } catch (e) {
    console.error("  物理删除异常:", e);
  }

  // 5. 更新时缺少字段（使用未定义字段）
  console.log("5. 更新时包含非法字段（应自动忽略）...");
  try {
    // update 会过滤 allowed 字段，所以不会报错，但我们可以测试无字段更新
    const res = await updateMaterialFile(1, {});
    console.log("  空更新结果:", res);
  } catch (e) {
    console.error("  空更新异常 (预期会抛出 No fields to update):", e);
  }

  // 6. 测试类型和版本的类似错误
  console.log("6. 更新不存在的素材类型...");
  try {
    await updateMaterialType(nonExistId, { type_name: "test" });
  } catch (e) {
    console.error("  类型更新异常:", e);
  }

  console.log("7. 更新不存在的素材版本...");
  try {
    await updateMaterialVersion(nonExistId, { name: "test" });
  } catch (e) {
    console.error("  版本更新异常:", e);
  }

  console.log("===== 错误处理测试完成 =====\n");
}

testErrors().catch(console.error);