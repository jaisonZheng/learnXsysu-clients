/**
 * 新的SYSU后端API服务
 * 替换原有的清华大学learn.tsinghua.edu.cn爬虫逻辑
 */

import axios from 'axios';

// SYSU后端API地址
const SYSU_API_BASE_URL = 'http://43.136.42.69:8000';

/**
 * 后端返回的原始数据结构（匹配实际返回）
 */
export interface SysuNoticeRaw {
  id: number;
  type: 'notice' | 'assignment';
  title: string;
  content: string;
  publisher: string;
  deadline: string | null; // ISO 8601格式或null
  url: string | null;
  course_name: string | null;
  unique_hash: string;
  created_at: string;
}

export interface SysuApiResponse {
  data: SysuNoticeRaw[];
}

/**
 * 从新后端获取通知/作业列表
 */
export const fetchSysuData = async (): Promise<SysuNoticeRaw[]> => {
  try {
    const response = await axios.get<SysuApiResponse>(`${SYSU_API_BASE_URL}/api/list`);
    return response.data.data || [];
  } catch (error) {
    console.error('Failed to fetch data from SYSU backend:', error);
    throw error;
  }
};
