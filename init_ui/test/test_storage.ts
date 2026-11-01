// single-request.ts
// 运行：deno run --allow-net single-request.ts

const res = await fetch("http://127.0.0.1:44944/ostfil", {
  method: "POST",
  headers: {
    "Content-Type": "application/libary",
    "FFI-Symbol": "storage",
  },
  body: JSON.stringify({
    file_path: "D:\\dayin\\video.mp4",
  }),
});

const data = await res.json();
console.log("响应状态码:", res.status);
console.log("响应内容:", data);