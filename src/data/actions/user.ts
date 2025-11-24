import { createAsyncAction } from 'typesafe-actions';
import {
  GET_USER_INFO_FAILURE,
  GET_USER_INFO_REQUEST,
  GET_USER_INFO_SUCCESS,
} from 'data/types/constants';
import { User } from 'data/types/state';
import { ThunkResult } from 'data/types/actions';

export const getUserInfoAction = createAsyncAction(
  GET_USER_INFO_REQUEST,
  GET_USER_INFO_SUCCESS,
  GET_USER_INFO_FAILURE,
)<undefined, User, Error>();

export function getUserInfo(): ThunkResult {
  return async dispatch => {
    dispatch(getUserInfoAction.request());

    try {
      // 后端未提供用户信息，使用示例数据（功能开发中）
      const mockUserInfo: User = {
        name: '测试用户',
        department: '计算机学院',
      };
      dispatch(getUserInfoAction.success(mockUserInfo));
    } catch (err) {
      dispatch(getUserInfoAction.failure(err as Error));
    }
  };
}
