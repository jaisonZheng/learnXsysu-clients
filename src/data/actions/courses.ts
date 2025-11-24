import { ApiError } from 'thu-learn-lib';
import { createAction, createAsyncAction } from 'typesafe-actions';
import { ThunkResult } from 'data/types/actions';
import {
  GET_COURSES_FOR_SEMESTER_FAILURE,
  GET_COURSES_FOR_SEMESTER_REQUEST,
  GET_COURSES_FOR_SEMESTER_SUCCESS,
  SET_HIDE_COURSE,
  SET_COURSE_ORDER,
} from 'data/types/constants';
import { Course } from 'data/types/state';
import { serializeError } from 'helpers/parse';

export const getCoursesForSemesterAction = createAsyncAction(
  GET_COURSES_FOR_SEMESTER_REQUEST,
  GET_COURSES_FOR_SEMESTER_SUCCESS,
  GET_COURSES_FOR_SEMESTER_FAILURE,
)<undefined, Course[], ApiError>();

export function getCoursesForSemester(semesterId: string): ThunkResult {
  return async dispatch => {
    dispatch(getCoursesForSemesterAction.request());

    // 后端未提供课程数据，使用示例数据（功能开发中）
    try {
      const mockCourses: Course[] = [
        {
          id: 'sysu-general',
          name: '功能开发中 / 测试课程',
          chineseName: '功能开发中 / 测试课程',
          englishName: 'SYSU General Feed',
          timeAndLocation: [],
          teacherName: '系统',
          teacherNumber: 'SYSU',
          courseNumber: 'SYSU-000',
          courseIndex: 0,
          semesterId,
        },
        {
          id: 'course-001',
          name: '软件工程',
          chineseName: '软件工程',
          englishName: 'Software Engineering',
          timeAndLocation: ['周一 9:00-11:00 教学楼A101'],
          teacherName: '张教授',
          teacherNumber: 'T001',
          courseNumber: 'CS301',
          courseIndex: 1,
          semesterId,
        },
        {
          id: 'course-002',
          name: '数据结构与算法',
          chineseName: '数据结构与算法',
          englishName: 'Data Structures and Algorithms',
          timeAndLocation: ['周三 14:00-16:00 实验楼B205'],
          teacherName: '李老师',
          teacherNumber: 'T002',
          courseNumber: 'CS202',
          courseIndex: 2,
          semesterId,
        },
        {
          id: 'course-003',
          name: '计算机网络',
          chineseName: '计算机网络',
          englishName: 'Computer Networks',
          timeAndLocation: ['周五 10:00-12:00 教学楼C302'],
          teacherName: '王博士',
          teacherNumber: 'T003',
          courseNumber: 'CS305',
          courseIndex: 3,
          semesterId,
        },
      ];

      dispatch(getCoursesForSemesterAction.success(mockCourses));
    } catch (err) {
      dispatch(getCoursesForSemesterAction.failure(serializeError(err)));
    }
  };
}

export const setHideCourse = createAction(
  SET_HIDE_COURSE,
  (courseId: string, flag: boolean) => ({ courseId, flag }),
)();

export const setCourseOrder = createAction(
  SET_COURSE_ORDER,
  (courseIds: string[]) => courseIds,
)();
