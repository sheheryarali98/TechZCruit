import {
  REGISTER_SUCCESS,
  REGISTER_FAILED,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  LOGOUT,
  USER_DELETED,
  PASSWORD_UPDATED,
  NAME_UPDATED,
  PROFILE_PICTURE_UPLOADED,
  PROFILE_PICTURE_REMOVED,
  SIDE_NAV_TOGGLED,
} from '../actions/types';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null,
  displaySideNav: true,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        user: payload,
        isAuthenticated: true,
        loading: false,
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem('token', payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
      };
    case REGISTER_FAILED:
    case AUTH_ERROR:
    case LOGIN_FAILED:
    case LOGOUT:
    case USER_DELETED:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
      };
    case SIDE_NAV_TOGGLED:
      return {
        ...state,
        displaySideNav: payload,
      };
    case PASSWORD_UPDATED:
    case NAME_UPDATED:
    case PROFILE_PICTURE_UPLOADED:
    case PROFILE_PICTURE_REMOVED:
    default:
      return state;
  }
}
