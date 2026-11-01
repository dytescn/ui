// src/apis/designVersions.ts
import { callLib, getLib, listLib } from "./lib.ts";

export const insertDesignVersion = async (data: any) =>
  await callLib("design_version_create", data);

export const updateDesignVersion = async (id: number, data: any) =>
  await callLib("design_version_update", { id, ...data });

export const deleteDesignVersion = async (id: number) =>
  await callLib("design_version_delete", { id, hard: true });

export const getDesignVersionById = async (id: number) =>
  await getLib("design_version_get", { id });

export const getDesignVersionsByDesign = async (designUid: string) =>
  await listLib("design_version_list", { limit: 500, filter: { design_uid: designUid } });

export const getDesignVersionsByChild = async (childUid: string) =>
  await listLib("design_version_list", { limit: 500, filter: { child_uid: childUid } });
