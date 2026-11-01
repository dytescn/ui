// 1. 导出封面图
const coverRes = await fetch("http://127.0.0.1:44944/cdrimex", {
  method: "POST",
  headers: {
    "Content-Type": "application/libary",
    "FFI-Symbol": "export_cover",          // 注意：服务端会自动匹配 post_ 前缀
  },
  body: JSON.stringify({
    cover_src: "D:\\backup\\cover.png",     // 封面保存路径
    ver: "26",
  }),
});
console.log("封面导出结果:", await coverRes.json());

// 2. 另存文件到新路径
const fileRes = await fetch("http://127.0.0.1:44944/cdrimex", {
  method: "POST",
  headers: {
    "Content-Type": "application/libary",
    "FFI-Symbol": "export_file",            // 另存文件接口
  },
  body: JSON.stringify({
    file_src: "D:\\backup\\backup.cdr",      // 目标文件路径
    ver: "26",
  }),
});
console.log("另存文件结果:", await fileRes.json());

const res = await fetch("http://127.0.0.1:44944/cdrimex", {
  method: "POST",
  headers: {
    "Content-Type": "application/libary",
    "FFI-Symbol": "current_file_path",   // 服务端会自动加 post_ 前缀
  },
  body: JSON.stringify({ ver: "26" }),
});
const result = await res.json();
console.log("当前文件路径:", result.data);