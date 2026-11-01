/**
 * 生成符合 RFC 4122 标准的 UUID v4
 * 优先使用 crypto.getRandomValues（安全），降级使用 Math.random（非安全，仅作 fallback）
 * @returns {string} 形如 xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx 的 UUID
 */
export const generateUUID = (): string=> {
  // 尝试使用 Web Crypto API（安全随机数）
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const buf = new Uint8Array(16);
    crypto.getRandomValues(buf);
    // 设置版本号 (第7个字节的高4位为 0100，即 0x40)
    buf[6] = (buf[6] & 0x0f) | 0x40;
    // 设置变体 (第9个字节的高2位为 10，即 0x80)
    buf[8] = (buf[8] & 0x3f) | 0x80;
    const hex = (b: number) => b.toString(16).padStart(2, '0');
    return (
      hex(buf[0]) + hex(buf[1]) + hex(buf[2]) + hex(buf[3]) +
      '-' + hex(buf[4]) + hex(buf[5]) +
      '-' + hex(buf[6]) + hex(buf[7]) +
      '-' + hex(buf[8]) + hex(buf[9]) +
      '-' + hex(buf[10]) + hex(buf[11]) + hex(buf[12]) + hex(buf[13]) + hex(buf[14]) + hex(buf[15])
    );
  }

  // 降级方案：使用 Math.random（不保证唯一性，仅用于不支持 crypto 的极端环境）
  // 注意：这不是标准 UUID，但格式一致
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}