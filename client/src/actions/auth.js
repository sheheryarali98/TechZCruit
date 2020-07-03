import axios from 'axios';
import {
  REGISTER_SUCCESS,
  REGISTER_FAILED,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  USER_LOADED,
  NAME_UPDATED,
  PASSWORD_UPDATED,
  PROFILE_PICTURE_UPLOADED,
  PROFILE_PICTURE_REMOVED,
  LOGOUT,
  CLEAR_PROFILE,
  AUTH_ERROR,
  SIDE_NAV_TOGGLED,
} from '../actions/types';
import { setAlert } from '../actions/alert';
import setAuthToken from '../utils/setAuthToken';

// Load user
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get('/api/auth');

    dispatch({ type: USER_LOADED, payload: res.data });
  } catch (err) {
    dispatch({ type: AUTH_ERROR });
  }
};

// Register user
export const register = (name, email, password) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ name, email, password });

  try {
    const res = await axios.post('/api/users', body, config);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: {
        token: res.data.token,
      },
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;
    console.log(errors);

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: REGISTER_FAILED,
    });
  }
};

// Login user
export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post('/api/auth', body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: {
        token: res.data.token,
      },
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: LOGIN_FAILED,
    });
  }
};

// Change password
export const changePassword = (password) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify({ password });

    await axios.put('/api/users/password', body, config);

    dispatch({ type: PASSWORD_UPDATED });

    dispatch(setAlert('Password updated', 'success'));

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
  }
};

// Change name
export const changeName = (name) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify({ name });

    await axios.put('/api/users/name', body, config);

    dispatch({ type: NAME_UPDATED });

    dispatch(setAlert('Name updated', 'success'));

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
  }
};

// Upload profile picture
export const uploadProfilePicture = (formData) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    await axios.put('/api/users/profile-picture/upload', formData, config);

    dispatch({
      type: PROFILE_PICTURE_UPLOADED,
    });

    dispatch(setAlert('Profile picture uploaded', 'success'));

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
  }
};

// Remove profile picture
export const removeProfilePicture = () => async (dispatch) => {
  try {
    await axios.put('/api/users/profile-picture/remove');

    dispatch({
      type: PROFILE_PICTURE_REMOVED,
    });

    dispatch(setAlert('Profile picture removed', 'success'));

    dispatch(loadUser());
  } catch (err) {
    dispatch(setAlert('Profile picture already removed', 'danger'));
  }
};

// Logout / Clear profile
export const logout = () => (dispatch) => {
  dispatch({ type: CLEAR_PROFILE });
  dispatch({ type: LOGOUT });
};

// Toggle side navbar
export const toggleSideNav = (displaySideNav) => (dispatch) => {
  dispatch({
    type: SIDE_NAV_TOGGLED,
    payload: displaySideNav,
  });
};
