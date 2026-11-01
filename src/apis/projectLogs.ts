// src/apis/projectLogs.ts
import { callLib, getLib, listLib } from "./lib.ts";

export const insertProjectLog = async (data: any) =>
  await callLib("log_create", data);

export const deleteProjectLog = async (id: number) =>
  await callLib("log_delete", { id, hard: true });

export const getProjectLogById = async (id: number) =>
  await getLib("log_get", { id });

export const getProjectLogsByProject = async (projectUid: string) =>
  await listLib("log_list", { limit: 500, filter: { project_uid: projectUid } });

export const getProjectLogsByTask = async (taskUid: string) =>
  await listLib("log_list", { limit: 500, filter: { task_uid: taskUid } });

export const getProjectLogsByStaff = async (staffUid: string) =>
  await listLib("log_list", { limit: 500, filter: { staff_uid: staffUid } });
