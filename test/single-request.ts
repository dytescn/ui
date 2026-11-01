// single-request-corrected.ts
// 运行：deno run --allow-net single-request-corrected.ts

const res = await fetch("http://127.0.0.1:44944/libostfil", {
  method: "POST",
  headers: {
    "Content-Type": "application/libary",        // 改为 application/os
    "FFI-Symbol": "storage",                // 保持不变
  },
  body: JSON.stringify({
    file_path: "D:\\dayin\\video.mp4",      // 路径根据你的实际文件
  }),
});

const data = await res.json();
console.log("响应状态码:", res.status);
console.log("响应内容:", data);