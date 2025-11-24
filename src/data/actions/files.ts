import { ApiError } from 'thu-learn-lib';
import { createAction, createAsyncAction } from 'typesafe-actions';
import { ThunkResult } from 'data/types/actions';
import {
  GET_ALL_FILES_FOR_COURSES_FAILURE,
  GET_ALL_FILES_FOR_COURSES_REQUEST,
  GET_ALL_FILES_FOR_COURSES_SUCCESS,
  GET_FILES_FOR_COURSE_FAILURE,
  GET_FILES_FOR_COURSE_REQUEST,
  GET_FILES_FOR_COURSE_SUCCESS,
  SET_FAV_FILE,
  SET_ARCHIVE_FILES,
} from 'data/types/constants';
import { File } from 'data/types/state';
import { serializeError } from 'helpers/parse';

export const getFilesForCourseAction = createAsyncAction(
  GET_FILES_FOR_COURSE_REQUEST,
  GET_FILES_FOR_COURSE_SUCCESS,
  GET_FILES_FOR_COURSE_FAILURE,
)<undefined, { courseId: string; files: File[] }, ApiError>();

export function getFilesForCourse(courseId: string): ThunkResult {
  return async (dispatch, getState) => {
    dispatch(getFilesForCourseAction.request());

    try {
      // 后端未提供文件数据，返回空列表（功能开发中）
      // 如果后端提供文件数据，可以在这里调用新API
      const files: File[] = [];
      dispatch(getFilesForCourseAction.success({ files, courseId }));
    } catch (err) {
      dispatch(getFilesForCourseAction.failure(serializeError(err)));
    }
  };
}

export const getAllFilesForCoursesAction = createAsyncAction(
  GET_ALL_FILES_FOR_COURSES_REQUEST,
  GET_ALL_FILES_FOR_COURSES_SUCCESS,
  GET_ALL_FILES_FOR_COURSES_FAILURE,
)<undefined, File[], ApiError>();

export function getAllFilesForCourses(courseIds: string[]): ThunkResult {
  return async (dispatch, getState) => {
    dispatch(getAllFilesForCoursesAction.request());

    try {
      // 后端未提供文件数据，返回空列表（功能开发中）
      // 如果后端提供文件数据，可以在这里调用新API
      const files: File[] = [];
      dispatch(getAllFilesForCoursesAction.success(files));
    } catch (err) {
      dispatch(getAllFilesForCoursesAction.failure(serializeError(err)));
    }
  };
}

export const setFavFile = createAction(
  SET_FAV_FILE,
  (fileId: string, flag: boolean) => ({
    fileId,
    flag,
  }),
)();

export const setArchiveFiles = createAction(
  SET_ARCHIVE_FILES,
  (fileIds: string[], flag: boolean) => ({
    fileIds,
    flag,
  }),
)();
