/**
 * 数据适配器 (Data Adapter)
 * 将SYSU后端返回的数据结构转换为App UI组件能识别的格式
 */

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Notice, Assignment } from 'data/types/state';
import { SysuNoticeRaw } from './api';

dayjs.extend(customParseFormat);

const SYSU_GENERAL_COURSE_ID = 'sysu-general';
const SYSU_DEFAULT_COURSE_NAME = '中山大学';

const normalizeTimestamp = (value: string | null, fallback: () => string): string => {
  if (!value) {
    return fallback();
  }

  const isoCandidate = value.includes(' ') ? value.replace(' ', 'T') : value;
  let parsed = dayjs(isoCandidate);

  if (!parsed.isValid()) {
    parsed = dayjs(value, 'YYYY-MM-DD HH:mm:ss');
  }

  if (!parsed.isValid()) {
    return fallback();
  }

  return parsed.toISOString();
};

/**
 * 将SYSU后端的数据转换为App的Notice格式
 */
export const adaptSysuDataToNotice = (raw: SysuNoticeRaw): Notice => {
  return {
    id: raw.unique_hash,
    title: raw.title,
    publisher: raw.publisher,
    publishTime: normalizeTimestamp(raw.deadline ?? raw.created_at, () =>
      dayjs().toISOString(),
    ),
    expireTime: undefined, // 后端没有提供过期时间
    markedImportant: false, // 后端没有提供，默认false
    content: raw.content,
    hasRead: false, // 后端没有提供，默认false
    attachment: undefined, // 后端当前没有附件信息
    url: raw.url || '',
    // 课程相关信息
    courseId: SYSU_GENERAL_COURSE_ID,
    courseName: raw.course_name || SYSU_DEFAULT_COURSE_NAME,
    courseTeacherName: raw.publisher,
  };
};

/**
 * 将SYSU后端的数据转换为App的Assignment格式
 * 注意：后端返回的type可以是'notice'或'assignment'
 */
export const adaptSysuDataToAssignment = (raw: SysuNoticeRaw): Assignment => {
  return {
    id: raw.unique_hash,
    studentHomeworkId: raw.unique_hash,
    title: raw.title,
    description: raw.content,
    deadline: normalizeTimestamp(raw.deadline ?? raw.created_at, () =>
      dayjs().add(7, 'day').toISOString(),
    ),
    lateSubmissionDeadline: undefined,
    completionType: 'INDIVIDUAL' as any,
    submissionType: 'ONLINE' as any,
    attachment: undefined,
    submitted: false,
    isLateSubmission: false,
    submitTime: undefined,
    submittedContent: undefined,
    submittedAttachment: undefined,
    graded: false,
    grade: undefined,
    gradeLevel: undefined,
    graderName: undefined,
    gradeTime: undefined,
    gradeContent: undefined,
    gradeAttachment: undefined,
    answerContent: undefined,
    answerAttachment: undefined,
    url: raw.url || '',
    excellentHomeworkList: undefined,
    // 课程相关信息
    courseId: SYSU_GENERAL_COURSE_ID,
    courseName: raw.course_name || SYSU_DEFAULT_COURSE_NAME,
    courseTeacherName: raw.publisher,
  };
};

/**
 * 批量转换数据，只转换type='notice'的数据
 */
export const adaptSysuDataListToNotices = (rawList: SysuNoticeRaw[]): Notice[] => {
  return rawList
    .filter(item => item.type === 'notice') // 只过滤通知类型
    .map(adaptSysuDataToNotice)
    .sort(
      (a, b) =>
        dayjs(b.publishTime).unix() - dayjs(a.publishTime).unix() ||
        b.id.localeCompare(a.id),
    );
};

/**
 * 批量转换数据，只转换type='assignment'的数据
 */
export const adaptSysuDataListToAssignments = (rawList: SysuNoticeRaw[]): Assignment[] => {
  return rawList
    .filter(item => item.type === 'assignment') // 只过滤作业类型
    .map(adaptSysuDataToAssignment)
    .sort(
      (a, b) =>
        dayjs(b.deadline).unix() - dayjs(a.deadline).unix() ||
        b.id.localeCompare(a.id),
    );
};
