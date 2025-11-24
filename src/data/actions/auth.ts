import { createAction, createAsyncAction } from 'typesafe-actions';
import { ApiError } from 'thu-learn-lib';
import { ThunkResult } from 'data/types/actions';
import {
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  SET_SSO_IN_PROGRESS,
} from 'data/types/constants';
import { Auth, AuthState } from 'data/types/state';
import { serializeError } from 'helpers/parse';

const DEFAULT_USERNAME = 'student2025';
const DEFAULT_PASSWORD = 'password123';
const DEFAULT_TOKEN_PREFIX = 'sysu-fake-token';
const DEFAULT_FINGER_PRINT = 'fake-fingerprint';
const DEFAULT_FINGER_GEN_PRINT = 'fake-genprint';
const DEFAULT_FINGER_GEN_PRINT3 = 'fake-genprint3';

const buildAuthPayload = (
  {
    username,
    password,
    fingerPrint,
    fingerGenPrint,
    fingerGenPrint3,
  }: {
    username?: string;
    password?: string;
    fingerPrint?: string;
    fingerGenPrint?: string;
    fingerGenPrint3?: string;
  },
  authState: AuthState,
): Auth => {
  const now = Date.now();
  return {
    username: username ?? authState.username ?? DEFAULT_USERNAME,
    password: password ?? authState.password ?? DEFAULT_PASSWORD,
    fingerPrint:
      fingerPrint ??
      authState.fingerPrint ??
      `${DEFAULT_FINGER_PRINT}-${now}`,
    fingerGenPrint:
      fingerGenPrint ??
      authState.fingerGenPrint ??
      `${DEFAULT_FINGER_GEN_PRINT}-${now}`,
    fingerGenPrint3:
      fingerGenPrint3 ??
      authState.fingerGenPrint3 ??
      `${DEFAULT_FINGER_GEN_PRINT3}-${now}`,
    token: authState.token ?? `${DEFAULT_TOKEN_PREFIX}-${now}`,
  };
};

export const loginAction = createAsyncAction(
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
)<{ clearCredential?: boolean }, Auth | undefined, ApiError>();

export function login({
  username,
  password,
  fingerPrint,
  fingerGenPrint = '',
  fingerGenPrint3 = '',
  reset = false,
}: {
  username?: string;
  password?: string;
  fingerPrint?: string;
  fingerGenPrint?: string;
  fingerGenPrint3?: string;
  reset?: boolean;
}): ThunkResult {
  return async (dispatch, getState) => {
    const { auth } = getState();

    if (auth.loggingIn) {
      return;
    }

    dispatch(
      loginAction.request({
        clearCredential: false,
      }),
    );

    try {
      const payload = buildAuthPayload(
        {
          username,
          password,
          fingerPrint,
          fingerGenPrint,
          fingerGenPrint3,
        },
        auth,
      );
      dispatch(loginAction.success(payload));
    } catch (err) {
      dispatch(loginAction.failure(serializeError(err)));
    }
  };
}

export function loginWithOfflineMode(): ThunkResult {
  return (dispatch, getState) => {
    const { auth } = getState();
    const payload = buildAuthPayload({}, auth);
    dispatch(loginAction.success(payload));
  };
}

export const setSSOInProgress = createAction(
  SET_SSO_IN_PROGRESS,
  (ssoInProgress: boolean) => ({
    ssoInProgress,
  }),
)();
