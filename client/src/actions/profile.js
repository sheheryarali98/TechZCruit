import axios from 'axios';
import {
  PROFILE_LOADED,
  EXPERIENCE_ADDED,
  EDUCATION_ADDED,
  EXPERIENCE_REMOVED,
  EDUCATION_REMOVED,
  PROFILE_DELETED,
  CLEAR_PROFILE,
  USER_DELETED,
  PROFILE_ERROR,
  SET_PROFILE_LOADING,
} from './types';
import { setAlert } from './alert';

// Get current profile
export const getCurrentProfile = () => async (dispatch) => {
  dispatch({
    type: SET_PROFILE_LOADING,
  });

  try {
    const res = await axios.get('/api/profiles/me');

    dispatch({
      type: PROFILE_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: err.response.data,
    });
  }
};

// Get profile by id
export const getProfileById = (id) => async (dispatch) => {
  dispatch({
    type: SET_PROFILE_LOADING,
  });

  try {
    const res = await axios.get(`/api/profiles/${id}`);

    dispatch({
      type: PROFILE_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
    });
  }
};

// Create/Update profile
export const createProfile = (formData, history, edit = false) => async (
  dispatch
) => {
  dispatch({
    type: SET_PROFILE_LOADING,
  });

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const res = await axios.post('/api/profiles', formData, config);

    dispatch({
      type: PROFILE_LOADED,
      payload: res.data,
    });

    dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'));

    history.push('/dashboard');
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({ type: CLEAR_PROFILE });
  }
};

// Add experience
export const addExperience = (formData, history) => async (dispatch) => {
  dispatch({
    type: SET_PROFILE_LOADING,
  });

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const res = await axios.put('/api/profiles/experience', formData, config);

    dispatch({
      type: EXPERIENCE_ADDED,
      payload: res.data,
    });

    dispatch(setAlert('Experience Added', 'success'));

    history.push('/dashboard');
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
  }
};

// Add education
export const addEducation = (formData, history) => async (dispatch) => {
  dispatch({
    type: SET_PROFILE_LOADING,
  });

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const res = await axios.put('/api/profiles/education', formData, config);

    dispatch({
      type: EDUCATION_ADDED,
      payload: res.data,
    });

    dispatch(setAlert('Education Added', 'success'));

    history.push('/dashboard');
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
  }
};

// Remove experience
export const removeExperience = (experienceId) => async (dispatch) => {
  dispatch({
    type: SET_PROFILE_LOADING,
  });

  try {
    const res = await axios.delete(`/api/profiles/experience/${experienceId}`);

    dispatch({
      type: EXPERIENCE_REMOVED,
      payload: res.data,
    });

    dispatch(setAlert('Experience Removed', 'success'));
  } catch (err) {
    dispatch(setAlert('Error occurred while removing experience', 'danger'));
  }
};

// Remove education
export const removeEducation = (educationId) => async (dispatch) => {
  dispatch({
    type: SET_PROFILE_LOADING,
  });

  try {
    const res = await axios.delete(`/api/profiles/education/${educationId}`);

    dispatch({
      type: EDUCATION_REMOVED,
      payload: res.data,
    });

    dispatch(setAlert('Education Removed', 'success'));
  } catch (err) {
    dispatch(setAlert('Error occurred while removing education', 'danger'));
  }
};

// Delete profile, user & posts
export const deleteProfile = () => async (dispatch) => {
  dispatch({
    type: SET_PROFILE_LOADING,
  });

  try {
    await axios.delete('/api/profiles');

    dispatch({ type: PROFILE_DELETED });
    dispatch({ type: USER_DELETED });
  } catch (err) {
    dispatch(setAlert('Error occurred while deleting account', 'danger'));
  }
};
