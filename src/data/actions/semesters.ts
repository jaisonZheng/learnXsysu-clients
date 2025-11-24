import { createAction, createAsyncAction } from 'typesafe-actions';
import { ApiError } from 'thu-learn-lib';
import { ThunkResult } from 'data/types/actions';
import {
  GET_ALL_SEMESTERS_FAILURE,
  GET_ALL_SEMESTERS_REQUEST,
  GET_ALL_SEMESTERS_SUCCESS,
  GET_CURRENT_SEMESTER_FAILURE,
  GET_CURRENT_SEMESTER_REQUEST,
  GET_CURRENT_SEMESTER_SUCCESS,
  SET_CURRENT_SEMESTER,
} from 'data/types/constants';
import { serializeError } from 'helpers/parse';

export const getAllSemestersAction = createAsyncAction(
  GET_ALL_SEMESTERS_REQUEST,
  GET_ALL_SEMESTERS_SUCCESS,
  GET_ALL_SEMESTERS_FAILURE,
)<undefined, string[], ApiError>();

export function getAllSemesters(): ThunkResult {
  return async dispatch => {
    dispatch(getAllSemestersAction.request());

    try {
      // 后端未提供学期数据，使用示例数据（功能开发中）
      const mockSemesters = [
        '2024-2025-1',
        '2024-2025-2', 
        '2023-2024-2',
        '2023-2024-1',
        '2022-2023-2',
      ];
      dispatch(getAllSemestersAction.success(mockSemesters));
    } catch (err) {
      dispatch(getAllSemestersAction.failure(serializeError(err)));
    }
  };
}

export const getCurrentSemesterAction = createAsyncAction(
  GET_CURRENT_SEMESTER_REQUEST,
  GET_CURRENT_SEMESTER_SUCCESS,
  GET_CURRENT_SEMESTER_FAILURE,
)<undefined, undefined, ApiError>();

export function getCurrentSemester(): ThunkResult {
  return async (dispatch, getState) => {
    dispatch(getCurrentSemesterAction.request());

    try {
      // 后端未提供当前学期数据，使用示例数据（功能开发中）
      const mockSemester = { id: '2024-2025-1' };
      dispatch(getCurrentSemesterAction.success());

      if (!getState().semesters.current) {
        dispatch(setCurrentSemester(mockSemester.id));
      }
    } catch (err) {
      dispatch(getCurrentSemesterAction.failure(serializeError(err)));
    }
  };
}

export const setCurrentSemester = createAction(
  SET_CURRENT_SEMESTER,
  (semesterId: string) => semesterId,
)();
