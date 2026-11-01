/**
 * 生成符合 RFC 4122 标准的 UUID v4（随机 UUID）
 * 兼容浏览器、Node.js、Deno 等所有现代 JavaScript 环境
 * 如果浏览器原生支持 crypto.randomUUID，则优先使用，否则使用 Polyfill
 */
export const generateUUID = (): string =>{
  // 1. 优先使用原生实现（最快且最安全）
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // 2. 降级方案：使用 crypto.getRandomValues 生成符合 UUID v4 格式的字符串
  // 参考：https://stackoverflow.com/questions/105034/how-to-create-guid-uuid
  // @ts-ignore - 为了兼容性，使用 any 忽略类型检查
  const cryptoObj = (typeof crypto !== 'undefined') ? crypto : (globalThis as any).crypto;
  if (cryptoObj && cryptoObj.getRandomValues) {
    const array = new Uint8Array(16);
    cryptoObj.getRandomValues(array);
    // 设置版本号 (v4): 将第7个字节的高4位设为 0100 (0x40)
    array[6] = (array[6] & 0x0f) | 0x40;
    // 设置变体: 将第9个字节的高2位设为 10 (0x80)
    array[8] = (array[8] & 0x3f) | 0x80;
    // 转换为十六进制字符串
    const hex = (byte: number) => byte.toString(16).padStart(2, '0');
    return (
      hex(array[0]) + hex(array[1]) + hex(array[2]) + hex(array[3]) + '-' +
      hex(array[4]) + hex(array[5]) + '-' +
      hex(array[6]) + hex(array[7]) + '-' +
      hex(array[8]) + hex(array[9]) + '-' +
      hex(array[10]) + hex(array[11]) + hex(array[12]) + hex(array[13]) + hex(array[14]) + hex(array[15])
    );
  }

  // 3. 最终降级方案：使用 Math.random()（不保证唯一性，但作为后备）
  console.warn('[uuid] 环境不支持 crypto.getRandomValues，使用 Math.random() 生成 UUID，可能存在碰撞风险');
  const template = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
  return template.replace(/[xy]/g, (char) => {
    const random = Math.random() * 16 | 0;
    const value = char === 'x' ? random : (random & 0x3 | 0x8);
    return value.toString(16);
  });
}

/**
 * 生成简短的唯一 ID（8 位），适用于短标识符
 * 注意：不保证全局唯一性，但碰撞概率极低
 */
export const generateShortId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID().slice(0, 8);
  }
  // 后备方案
  return Math.random().toString(36).substring(2, 10);
}

/**
 * 验证字符串是否符合 UUID v4 格式
 */
export const isValidUUID = (uuid: string): boolean => {
  const pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return pattern.test(uuid);
}