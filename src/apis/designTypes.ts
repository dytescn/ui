// src/apis/designTypes.ts
import { callLib, getLib, listLib } from "./lib.ts";

export const insertDesignType = async (data: any) =>
  await callLib("design_type_create", data);

export const updateDesignType = async (id: number, data: any) =>
  await callLib("design_type_update", { id, ...data });

export const deleteDesignType = async (id: number) =>
  await callLib("design_type_delete", { id, hard: true });

export const getDesignTypeById = async (id: number) =>
  await getLib("design_type_get", { id });

export const getAllDesignTypes = async () =>
  await listLib("design_type_list", { limit: 500 });
