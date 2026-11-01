// src/apis/type.ts
import { callLib, getLib, listLib, parseWhere } from "./lib.ts";

export const insertMaterialType = async (data: any) =>
  await callLib("type_create", data);

export const updateMaterialType = async (id: number, data: any) =>
  await callLib("type_update", { id, ...data });

export const softDeleteMaterialType = async (id: number) =>
  await callLib("type_delete", { id });

export const deleteMaterialType = async (id: number) =>
  await callLib("type_delete", { id, hard: true });

export const getMaterialTypeById = async (id: number) =>
  await getLib("type_get", { id });

export const getMaterialTypeList = async (
  where = "",
  order = "id DESC",
  limit?: number,
) => await listLib("type_list", { limit: limit ?? 1000, order, filter: parseWhere(where) });

export const getMaterialTypeByName = async (typeName: string) =>
  (await listLib("type_list", { limit: 1, filter: { type_name: typeName } }))[0] ?? null;

export const getMaterialTypeByUuid = async (uuid: string) =>
  await getLib("type_get", { uuid });
