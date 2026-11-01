// src/apis/projectVersionLogs.ts
import { callLib, getLib, listLib } from "./lib.ts";

export const insertProjectVersionLog = async (data: any) =>
  await callLib("version_log_create", data);

export const deleteProjectVersionLog = async (id: number) =>
  await callLib("version_log_delete", { id, hard: true });

export const getProjectVersionLogById = async (id: number) =>
  await getLib("version_log_get", { id });

export const getProjectVersionLogsByProject = async (projectUid: string) =>
  await listLib("version_log_list", { limit: 500, filter: { project_uid: projectUid } });

export const getProjectVersionLogsByFeatures = async (featuresUid: string) =>
  await listLib("version_log_list", { limit: 500, filter: { features_uid: featuresUid } });
