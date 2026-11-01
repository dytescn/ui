// // create_project.ts
// import { create_project_tpl } from "../view/create.ts";
// import { insertProject } from "../apis/projects.ts";
// import { project_init } from "./project.ts"; // 新增导入

// export const create_project = () => {
//   const popup_node = document.getElementById("popup");
//   if (popup_node) {
//     popup_node.innerHTML = create_project_tpl;
//     cancel_project(popup_node);
//     submit_project(popup_node);
//   }
// };

// const cancel_project = (node: HTMLElement) => {
//   const cancel_btn = node.querySelector("#cancel");
//   if (cancel_btn) {
//     cancel_btn.addEventListener("click", () => {
//       node.innerHTML = "";
//     });
//   }
// };

// const submit_project = (node: HTMLElement) => {
//   const submit_btn = node.querySelector("#define");
//   if (submit_btn) {
//     submit_btn.addEventListener("click", async () => {
//       const input = node.querySelector("#name_dom input") as HTMLInputElement;
//       const name = input?.value?.trim();
//       const errorTip = node.querySelector("#name_dom .error-tip") as HTMLElement;

//       errorTip.textContent = "";
//       errorTip.className = "error-tip";

//       if (!name) {
//         errorTip.textContent = "请输入项目名称";
//         errorTip.classList.add("error");
//         return;
//       }

//       try {
//         const result = await insertProject({ name });
//         if (result && result.code === 200) {
//           // 创建成功：清空弹窗
//           node.innerHTML = "";
//           // 刷新项目列表（重新获取并渲染）
//           await project_init();
//         } else {
//           errorTip.textContent = "创建失败: " + (result?.msg || "未知错误");
//           errorTip.classList.add("error");
//         }
//       } catch (error: any) {
//         errorTip.textContent = "请求失败: " + error.message;
//         errorTip.classList.add("error");
//       }
//     });
//   }
// };