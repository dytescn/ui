// src/apis/version.ts
import { callLib, getLib, listLib, parseWhere } from "./lib.ts";

export const insertMaterialVersion = async (data: any) =>
  await callLib("version_create", data);

export const updateMaterialVersion = async (id: number, data: any) =>
  await callLib("version_update", { id, ...data });

export const softDeleteMaterialVersion = async (id: number) =>
  await callLib("version_delete", { id });

export const deleteMaterialVersion = async (id: number) =>
  await callLib("version_delete", { id, hard: true });

export const getMaterialVersionById = async (id: number) =>
  await getLib("version_get", { id });

export const getMaterialVersionList = async (
  where = "",
  order = "id DESC",
  limit?: number,
) => await listLib("version_list", { limit: limit ?? 1000, order, filter: parseWhere(where) });

export const getMaterialVersionsByDesignUid = async (designUid: string) =>
  await listLib("version_list", { limit: 200, filter: { design_uid: designUid } });

export const getMaterialVersionsByFuid = async (fuid: string) =>
  await listLib("version_list", { limit: 200, filter: { fuid } });
