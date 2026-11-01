// src/apis/projectVersions.ts
import { callLib, getLib, listLib } from "./lib.ts";

export const insertProjectVersion = async (data: any) =>
  await callLib("version_create", data);

export const updateProjectVersion = async (id: number, data: any) =>
  await callLib("version_update", { id, ...data });

export const deleteProjectVersion = async (id: number) =>
  await callLib("version_delete", { id, hard: true });

export const getProjectVersionById = async (id: number) =>
  await getLib("version_get", { id });

export const getProjectVersionsByProject = async (projectUid: string) =>
  await listLib("version_list", { limit: 500, filter: { project_uid: projectUid } });
