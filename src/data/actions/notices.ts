import { ApiError } from 'thu-learn-lib';
import { createAction, createAsyncAction } from 'typesafe-actions';
import { fetchSysuData } from 'data/api';
import { adaptSysuDataListToNotices } from 'data/adapter';
import { ThunkResult } from 'data/types/actions';
import {
  GET_ALL_NOTICES_FOR_COURSES_FAILURE,
  GET_ALL_NOTICES_FOR_COURSES_REQUEST,
  GET_ALL_NOTICES_FOR_COURSES_SUCCESS,
  GET_NOTICES_FOR_COURSE_FAILURE,
  GET_NOTICES_FOR_COURSE_REQUEST,
  GET_NOTICES_FOR_COURSE_SUCCESS,
  SET_FAV_NOTICE,
  SET_ARCHIVE_NOTICES,
} from 'data/types/constants';
import { Notice } from 'data/types/state';
import { serializeError } from 'helpers/parse';

export const getNoticesForCourseAction = createAsyncAction(
  GET_NOTICES_FOR_COURSE_REQUEST,
  GET_NOTICES_FOR_COURSE_SUCCESS,
  GET_NOTICES_FOR_COURSE_FAILURE,
)<undefined, { courseId: string; notices: Notice[] }, ApiError>();

export function getNoticesForCourse(courseId: string): ThunkResult {
  return async (dispatch, getState) => {
    dispatch(getNoticesForCourseAction.request());

    try {
      // 使用新的SYSU后端API代替清华服务器
      const rawData = await fetchSysuData();
      const notices = adaptSysuDataListToNotices(rawData);
      dispatch(getNoticesForCourseAction.success({ notices, courseId }));
    } catch (err) {
      dispatch(getNoticesForCourseAction.failure(serializeError(err)));
    }
  };
}

export const getAllNoticesForCoursesAction = createAsyncAction(
  GET_ALL_NOTICES_FOR_COURSES_REQUEST,
  GET_ALL_NOTICES_FOR_COURSES_SUCCESS,
  GET_ALL_NOTICES_FOR_COURSES_FAILURE,
)<undefined, Notice[], ApiError>();

export function getAllNoticesForCourses(courseIds: string[]): ThunkResult {
  return async (dispatch, getState) => {
    dispatch(getAllNoticesForCoursesAction.request());

    try {
      // 使用新的SYSU后端API代替原有的清华服务器爬虫
      const rawData = await fetchSysuData();
      const notices = adaptSysuDataListToNotices(rawData);
      
      // 原有的爬虫代码已注释
      // const results = await dataSource.getAllContents(
      //   courseIds,
      //   ContentType.NOTIFICATION,
      // );
      // const courseNames = getState().courses.names;
      // const notices = Object.keys(results)
      //   .map(courseId => {
      //     const noticesForCourse = results[courseId];
      //     const courseName = courseNames[courseId];
      //     return noticesForCourse.map<Notice>(notice => ({
      //       ...notice,
      //       courseId,
      //       courseName: courseName.name,
      //       courseTeacherName: courseName.teacherName,
      //     }));
      //   })
      //   .reduce((a, b) => a.concat(b), [])
      //   .sort(
      //     (a, b) =>
      //       dayjs(b.publishTime).unix() - dayjs(a.publishTime).unix() ||
      //       b.id.localeCompare(a.id),
      //   );
      
      dispatch(getAllNoticesForCoursesAction.success(notices));
    } catch (err) {
      dispatch(getAllNoticesForCoursesAction.failure(serializeError(err)));
    }
  };
}

export const setFavNotice = createAction(
  SET_FAV_NOTICE,
  (noticeId: string, flag: boolean) => ({
    noticeId,
    flag,
  }),
)();

export const setArchiveNotices = createAction(
  SET_ARCHIVE_NOTICES,
  (noticeIds: string[], flag: boolean) => ({
    noticeIds,
    flag,
  }),
)();
