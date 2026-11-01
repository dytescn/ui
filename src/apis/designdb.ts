// src/apis/designdb.ts
// 设计软件列表：不再直接访问 designdb，改为 info_lib 的 info 设置项。
import { getSetting, setSetting } from "./setting.ts";

const SETTING_KEY = "designsoft_list";

export interface SoftwareInfo {
  id?: number;
  name: string;
  version: string;
  major_version?: string;
  minor_version?: string;
  install_path?: string;
  publisher?: string;
  install_date?: string;
  exe_path?: string;
  status?: "未安装" | "已安装但未启动" | "已启动";
}

async function load(): Promise<SoftwareInfo[]> {
  const value = await getSetting(SETTING_KEY);
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed as SoftwareInfo[] : [];
  } catch {
    return [];
  }
}

async function save(list: SoftwareInfo[]): Promise<void> {
  await setSetting(SETTING_KEY, JSON.stringify(list));
}

export const insertSoftware = async (data: Omit<SoftwareInfo, "id">) => {
  const list = await load();
  const id = list.reduce((max, item) => Math.max(max, item.id ?? 0), 0) + 1;
  list.push({ ...data, id });
  await save(list);
};

export const querySoftware = async (
  filter?: { name?: string; version?: string },
) => {
  const list = await load();
  if (!filter) return list;
  return list.filter((item) =>
    (filter.name === undefined || item.name === filter.name) &&
    (filter.version === undefined || item.version === filter.version)
  );
};

export const updateSoftware = async (
  id: number,
  data: Partial<SoftwareInfo>,
) => {
  const list = await load();
  const index = list.findIndex((item) => item.id === id);
  if (index < 0) return;
  list[index] = { ...list[index], ...data, id };
  await save(list);
};

export const deleteSoftware = async (id: number) => {
  const list = await load();
  await save(list.filter((item) => item.id !== id));
};

export const syncSoftwareFromApi = async (
  keyword: string,
  getInfoFn: (keyword: string) => Promise<{ data?: { list?: SoftwareInfo[] } }>,
) => {
  const info = await getInfoFn(keyword);
  if (!info.data?.list || info.data.list.length === 0) {
    console.warn(`未找到关键字 "${keyword}" 对应的软件`);
    return;
  }
  for (const software of info.data.list) {
    const existing = await querySoftware({
      name: software.name,
      version: software.version,
    });
    if (existing.length > 0) {
      await updateSoftware(existing[0].id!, {
        major_version: software.major_version || "",
        minor_version: software.minor_version || "",
        install_path: software.install_path || "",
      });
    } else {
      await insertSoftware({
        name: software.name,
        version: software.version,
        major_version: software.major_version || "",
        minor_version: software.minor_version || "",
        install_path: software.install_path || "",
        status: "已安装但未启动",
      });
    }
  }
};

export const getSoftwareList = async (): Promise<SoftwareInfo[]> => {
  return await load();
};
