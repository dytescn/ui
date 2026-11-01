// ============================================================
// 纯 TypeScript 测试客户端（浏览器环境）
// 使用内置 WebSocket 和 fetch，零外部依赖
// ============================================================

const BASE_URL = 'http://localhost:44944';
const WS_URL = 'ws://localhost:44944/soket';

// ---------- 辅助：延迟 ----------
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// ---------- WebSocket 测试 ----------
function testWebSocket() {
  console.log('[WS] Connecting...');
  const ws = new WebSocket(WS_URL);

  ws.onopen = () => {
    console.log('[WS] Connected');

    // 发送 ping
    ws.send('ping');

    // 发送 status 文本命令
    setTimeout(() => ws.send('status'), 500);

    // 发送 JSON 命令：bind
    setTimeout(() => {
      ws.send(JSON.stringify({
        cmd: 'bind',
        uuid: 'test-uuid-123',
        lib: 'soket_demo'
      }));
    }, 1000);

    // 发送 JSON 命令：status
    setTimeout(() => {
      ws.send(JSON.stringify({ cmd: 'status' }));
    }, 1500);

    // 发送 JSON 命令：msg
    setTimeout(() => {
      ws.send(JSON.stringify({
        cmd: 'msg',
        uuid: 'test-uuid-123',
        data: 'Hello from pure TS client'
      }));
    }, 2000);

    // 发送 JSON 命令：remove
    setTimeout(() => {
      ws.send(JSON.stringify({
        cmd: 'remove',
        uuid: 'test-uuid-123'
      }));
    }, 2500);

    // 发送普通文本（非 JSON）
    setTimeout(() => {
      ws.send('Plain text message');
    }, 3000);

    // 4.5秒后关闭
    setTimeout(() => {
      ws.close();
      console.log('[WS] Test sequence completed.');
    }, 4500);
  };

  ws.onmessage = (ev: MessageEvent) => {
    const msg = ev.data.toString();
    console.log('[WS] Received:', msg);
    // 尝试解析 JSON
    try {
      const json = JSON.parse(msg);
      console.log('[WS] Parsed JSON:', JSON.stringify(json, null, 2));
    } catch {
      // 不是 JSON，忽略
    }
  };

  ws.onerror = (err) => console.error('[WS] Error:', err);
  ws.onclose = () => console.log('[WS] Disconnected');
}

// ---------- HTTP API 测试 ----------
async function testHttpApi() {
  console.log('\n[HTTP] Starting API tests...');

  try {
    // 1. GET /api/status
    const statusResp = await fetch(`${BASE_URL}/api/status`);
    const statusData = await statusResp.json();
    console.log('[HTTP] GET /api/status ->', statusData);

    // 2. POST /api/push
    const pushResp = await fetch(`${BASE_URL}/api/push`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Hello from pure TS', time: Date.now() })
    });
    const pushData = await pushResp.json();
    console.log('[HTTP] POST /api/push ->', pushData);

    // 3. POST /api/iceoryx
    const iceoResp = await fetch(`${BASE_URL}/api/iceoryx`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sensor: 'temp', value: 25.3 })
    });
    const iceoData = await iceoResp.json();
    console.log('[HTTP] POST /api/iceoryx ->', iceoData);

    // 4. POST /api/log
    const logResp = await fetch(`${BASE_URL}/api/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ level: 'info', message: 'Test log' })
    });
    const logData = await logResp.json();
    console.log('[HTTP] POST /api/log ->', logData);

    // 5. OPTIONS 预检（CORS）
    const optionsResp = await fetch(`${BASE_URL}/api/push`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://example.com',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    console.log('[HTTP] OPTIONS response headers:', Object.fromEntries(optionsResp.headers));
  } catch (err) {
    console.error('[HTTP] Error:', err);
  }
}

// ---------- 主入口 ----------
async function main() {
  console.log('=== Cyctron Server Test (Pure TypeScript) ===\n');

  // 启动 WebSocket 测试（不等待）
  testWebSocket();

  // 等待 1 秒后执行 HTTP 测试
  await sleep(1000);
  await testHttpApi();

  // 保持控制台输出，等待 WebSocket 消息收完
  await sleep(5000);
  console.log('\nTest completed.');
}

// 如果在浏览器中作为模块加载，自动运行
if (typeof window !== 'undefined') {
  main().catch(console.error);
}