// src/apis/material.ts
import { callLib, getLib, listLib, pageLib, parseWhere } from "./lib.ts";

export const insertMaterialFile = async (data: any) =>
  await callLib("file_create", data);

export const updateMaterialFile = async (id: number, data: any) =>
  await callLib("file_update", { id, ...data });

export const updateMaterialFileByUuid = async (uuid: string, data: any) =>
  await callLib("file_update", { uuid, ...data });

export const softDeleteMaterialFile = async (id: number) =>
  await callLib("file_delete", { id });

export const softDeleteMaterialFileByUuid = async (uuid: string) =>
  await callLib("file_delete", { uuid });

export const deleteMaterialFile = async (id: number) =>
  await callLib("file_delete", { id, hard: true });

export const getMaterialFileById = async (id: number) =>
  await getLib("file_get", { id });

export const getMaterialFileByUuid = async (uuid: string) =>
  await getLib("file_get", { uuid });

export const getMaterialFileList = async (
  where = "",
  order = "id DESC",
  limit = 40,
) => await listLib("file_list", { limit, order, filter: parseWhere(where) });

export const getMaterialFilePage = async (
  page: number,
  pageSize: number,
  where = "",
  order = "id DESC",
) => {
  const data = await pageLib("file_list", {
    page,
    page_size: pageSize,
    order,
    filter: parseWhere(where),
  });
  return data.list;
};

export const getMaterialFileCount = async (where = "") => {
  const data = await pageLib("file_list", {
    page: 1,
    page_size: 1,
    filter: parseWhere(where),
  });
  return data.total;
};

export const getMaterialFilesByProjectUid = async (projectUid: string) =>
  await listLib("file_list", { limit: 200, filter: { project_uid: projectUid } });

export const getMaterialFilesByOrganUid = async (organUid: string) =>
  await listLib("file_list", { limit: 200, filter: { organ_uid: organUid } });

export const getMaterialFilesByTypeUid = async (typeUid: string) =>
  await listLib("file_list", { limit: 200, filter: { type_uid: typeUid } });
