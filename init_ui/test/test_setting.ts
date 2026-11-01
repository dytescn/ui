// test/test_setting.ts
import {
  setSetting,
  getSetting,
  getAllSettings,
  deleteSetting,
  setSettings,
  deleteSettings,
} from "../src/apis/setting.ts";

async function main() {
  console.log("🚀 开始测试 Setting 数据库操作...\n");

  // 1. 设置配置项
  console.log("📝 设置配置项...");
  await setSetting("theme", "dark");
  await setSetting("language", "zh-CN");
  await setSetting("auto_start", "true");
  console.log("✅ 配置已设置\n");

  // 2. 查询单个配置
  console.log("🔍 查询配置 'theme':");
  const theme = await getSetting("theme");
  console.log(`theme: ${theme}\n`);

  // 3. 获取所有配置
  console.log("📊 所有配置:");
  const all = await getAllSettings();
  if (all.length === 0) {
    console.log("  （无记录）\n");
  } else {
    for (const item of all) {
      console.log(`  ${item.key} = ${item.value}`);
    }
    console.log();
  }

  // 4. 更新配置
  console.log("✏️ 更新配置 'theme' 为 'light'...");
  await setSetting("theme", "light");
  const updatedTheme = await getSetting("theme");
  console.log(`theme 更新后: ${updatedTheme}\n`);

  // 5. 查询值包含 'true' 的配置（客户端过滤）
  console.log("🔎 查询 value 包含 'true' 的配置:");
  const allData = await getAllSettings();
  const filtered = allData.filter(item => item.value.includes("true"));
  if (filtered.length === 0) {
    console.log("  无匹配\n");
  } else {
    for (const item of filtered) {
      console.log(`  ${item.key} = ${item.value}`);
    }
    console.log();
  }

  // 6. 删除配置
  console.log("🗑️ 删除配置 'auto_start'...");
  await deleteSetting("auto_start");
  const afterDelete = await getSetting("auto_start");
  console.log(`删除后 auto_start: ${afterDelete}\n`);

  // 7. 批量操作
  console.log("📦 批量设置配置...");
  await setSettings({
    test_key1: "value1",
    test_key2: "value2",
  });
  console.log("批量设置完成，当前所有配置:");
  const allAfterBatch = await getAllSettings();
  for (const item of allAfterBatch) {
    console.log(`  ${item.key} = ${item.value}`);
  }
  console.log();

  console.log("🧹 清理测试配置...");
  await deleteSettings(["test_key1", "test_key2"]);
  console.log("清理完成\n");

  console.log("✅ 测试完成");
}

if (import.meta.main) {
  await main();
}