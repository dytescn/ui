// src/apis/designFiles.ts
import { callLib, getLib, listLib } from "./lib.ts";

export const insertDesignFile = async (data: any) =>
  await callLib("design_file_create", data);

export const updateDesignFile = async (id: number, data: any) =>
  await callLib("design_file_update", { id, ...data });

export const deleteDesignFile = async (id: number) =>
  await callLib("design_file_delete", { id, hard: true });

export const getDesignFileById = async (id: number) =>
  await getLib("design_file_get", { id });

export const getDesignFilesByProject = async (projectUid: string) =>
  await listLib("design_file_list", { limit: 500, filter: { project_uid: projectUid } });

export const getDesignFilesByType = async (typeUid: string) =>
  await listLib("design_file_list", { limit: 500, filter: { type_uid: typeUid } });

export const getDesignFileByUuid = async (uuid: string) =>
  await getLib("design_file_get", { uuid });
