// src/types/software.ts
export interface SoftwareInfo {
  id?: number;
  name: string;
  version: string;
  install_path: string;
  publisher?: string;
  install_date?: string;
  exe_path?: string;
  status?: string;
  config?: any;
  child?: any;
  created_at?: string;
  updated_at?: string;
}