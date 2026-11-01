// src/apis/projectFeatures.ts
import { callLib, getLib, listLib } from "./lib.ts";

export const insertProjectFeature = async (data: any) =>
  await callLib("feature_create", data);

export const updateProjectFeature = async (id: number, data: any) =>
  await callLib("feature_update", { id, ...data });

export const deleteProjectFeature = async (id: number) =>
  await callLib("feature_delete", { id, hard: true });

export const getProjectFeatureById = async (id: number) =>
  await getLib("feature_get", { id });

export const getProjectFeaturesByProject = async (projectUid: string) =>
  await listLib("feature_list", { limit: 500, filter: { project_uid: projectUid } });
