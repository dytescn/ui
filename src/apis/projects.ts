// src/apis/projects.ts
import { callLib, getLib, listLib, pageLib, parseWhere } from "./lib.ts";

export const insertProject = async (data: any) =>
  await callLib("project_create", data);

export const updateProject = async (id: number, data: any) =>
  await callLib("project_update", { id, ...data });

export const softDeleteProject = async (id: number) =>
  await callLib("project_delete", { id });

export const deleteProject = async (id: number) =>
  await callLib("project_delete", { id, hard: true });

export const getProjectById = async (id: number) =>
  await getLib("project_get", { id });

export const getProjects = async (
  where = "",
  order = "id DESC",
  limit?: number,
) => await listLib("project_list", { limit: limit ?? 1000, order, filter: parseWhere(where) });

export const getProjectsByOrgan = async (organUid: string) =>
  await listLib("project_list", { limit: 1000, filter: { organ_uid: organUid } });

export const getProjectsByCreator = async (createBy: string) =>
  await listLib("project_list", { limit: 1000, filter: { create_by: createBy } });

export const getProjectByUuid = async (uuid: string) =>
  await getLib("project_get", { uuid });

export const getProjectsPage = async (
  page: number,
  pageSize: number,
  where = "",
  order = "id DESC",
) => {
  const data = await pageLib("project_list", {
    page,
    page_size: pageSize,
    order,
    filter: parseWhere(where),
  });
  return data.list;
};

export const getProjectsCount = async (where = "") => {
  const data = await pageLib("project_list", {
    page: 1,
    page_size: 1,
    filter: parseWhere(where),
  });
  return data.total;
};
