import axios from 'axios';
import {
  ALL_PROJECTS_LOADED,
  ALL_PROJECTS_LOADED_FOR_USER,
  ALL_ONGOING_PROJECTS_LOADED_FOR_USER,
  PROJECT_LOADED,
  PROJECT_CREATED,
  PROJECT_UPDATED,
  PROJECT_OFFER_SENT,
  PROJECT_TESTER_ADDED,
  PROJECT_TESTCASE_CREATED,
  PROJECT_TESTCASE_PASSED,
  PROJECT_TESTCASE_FAILED,
  PROJECT_TESTING_FINISHED,
  COMMENT_ADDED_PROJECT,
  COMMENT_REMOVED_PROJECT,
  PROJECT_TESTCASE_DELETED,
  PROJECT_OFFER_DELETED,
  PROJECT_DELETED,
  PROJECT_ERROR,
  SET_PROJECT_LOADING,
} from '../../actions/types';
import { setAlert } from '../../actions/alert';

// Get all projects
export const getAllProjects = () => async (dispatch) => {
  dispatch({
    type: SET_PROJECT_LOADING,
  });

  try {
    const res = await axios.get('/api/testing/projects');

    dispatch({
      type: ALL_PROJECTS_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get all ongoing projects for user
export const getAllOngoingProjectsForCurrentUser = () => async (dispatch) => {
  dispatch({
    type: SET_PROJECT_LOADING,
  });

  try {
    const res = await axios.get('/api/testing/projects/user/ongoing');

    dispatch({
      type: ALL_ONGOING_PROJECTS_LOADED_FOR_USER,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get project by id
export const getProjectById = (id) => async (dispatch) => {
  dispatch({
    type: SET_PROJECT_LOADING,
  });

  try {
    const res = await axios.get(`/api/testing/projects/${id}`);

    dispatch({
      type: PROJECT_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get project for current user
export const getAllProjectsForCurrentUser = () => async (dispatch) => {
  dispatch({
    type: SET_PROJECT_LOADING,
  });

  try {
    const res = await axios.get('/api/testing/projects/user');

    dispatch({
      type: ALL_PROJECTS_LOADED_FOR_USER,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Search for a project
export const searchProject = (description) => async (dispatch) => {
  dispatch({
    type: SET_PROJECT_LOADING,
  });

  try {
    const res = await axios.get(`/api/testing/projects/search/${description}`);

    dispatch({
      type: ALL_PROJECTS_LOADED,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Create a new project
export const createProject = (formData, history) => async (dispatch) => {
  dispatch({
    type: SET_PROJECT_LOADING,
  });

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const res = await axios.post('/api/testing/projects', formData, config);

    dispatch({
      type: PROJECT_CREATED,
      payload: res.data,
    });

    dispatch(setAlert('Project created', 'success'));

    history.push('/testing/my-projects');
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Create a testcase for a project
export const createTestcaseForProject = (
  projectId,
  formData,
  history
) => async (dispatch) => {
  dispatch({
    type: SET_PROJECT_LOADING,
  });

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const res = await axios.put(
      `/api/testing/projects/testcase/${projectId}`,
      formData,
      config
    );

    dispatch({
      type: PROJECT_TESTCASE_CREATED,
      payload: res.data,
    });

    dispatch(setAlert('Test case created', 'success'));

    history.push(`/testing/project/testcases/${projectId}`);
  } catch (err) {
    console.log(err);
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Add tester to a project
export const addTesterToProject = (projectId, userId) => async (dispatch) => {
  dispatch({
    type: SET_PROJECT_LOADING,
  });

  try {
    const res = await axios.put(`/api/testing/projects/${projectId}/${userId}`);

    dispatch({
      type: PROJECT_TESTER_ADDED,
      payload: res.data,
    });

    dispatch(setAlert('Tester added', 'success'));
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Finish testing for a project
export const finishTestingForProject = (projectId) => async (dispatch) => {
  dispatch({
    type: SET_PROJECT_LOADING,
  });

  try {
    const res = await axios.put(`/api/testing/projects/finish/${projectId}`);

    dispatch({
      type: PROJECT_TESTING_FINISHED,
      payload: res.data._id,
    });

    dispatch(setAlert('Project testing finished', 'success'));
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Pass a test case for a project
export const passTestcaseForProject = (projectId, testCaseId) => async (
  dispatch
) => {
  dispatch({
    type: SET_PROJECT_LOADING,
  });

  try {
    const res = await axios.put(
      `/api/testing/projects/testcase/pass/${projectId}/${testCaseId}`
    );

    dispatch({
      type: PROJECT_TESTCASE_PASSED,
      payload: res.data,
    });

    dispatch(setAlert('Project test case passed', 'success'));
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Fail a test case for a project
export const failTestcaseForProject = (projectId, testCaseId) => async (
  dispatch
) => {
  dispatch({
    type: SET_PROJECT_LOADING,
  });

  try {
    const res = await axios.put(
      `/api/testing/projects/testcase/fail/${projectId}/${testCaseId}`
    );

    dispatch({
      type: PROJECT_TESTCASE_FAILED,
      payload: res.data,
    });

    dispatch(setAlert('Project test case failed', 'success'));
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Comment on project
export const addCommentOnProject = (id, formData) => async (dispatch) => {
  dispatch({
    type: SET_PROJECT_LOADING,
  });

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const res = await axios.put(
      `/api/testing/projects/comment/${id}`,
      formData,
      config
    );

    dispatch({
      type: COMMENT_ADDED_PROJECT,
      payload: res.data,
    });

    dispatch(setAlert('Comment added', 'success'));
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
  }
};

// Update a project
export const updateProject = (id, formData, history) => async (dispatch) => {
  dispatch({
    type: SET_PROJECT_LOADING,
  });

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const res = await axios.put(
      `/api/testing/projects/${id}`,
      formData,
      config
    );

    dispatch({
      type: PROJECT_UPDATED,
      payload: res.data,
    });

    dispatch(setAlert('Project updated', 'success'));

    history.push('/testing/my-projects');
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Send offer for project
export const sendOfferForProject = (id, amount, paymentMethodId) => async (
  dispatch
) => {
  dispatch({
    type: SET_PROJECT_LOADING,
  });

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ amount, paymentMethodId });

  try {
    const res = await axios.put(
      `/api/testing/projects/offer/${id}`,
      body,
      config
    );

    dispatch({
      type: PROJECT_OFFER_SENT,
      payload: res.data,
    });

    dispatch(setAlert('Offer for project has been sent', 'success'));
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });

    dispatch(setAlert(err.response.data.msg, 'danger'));
  }
};

// Delete a project
export const deleteProject = (id) => async (dispatch) => {
  dispatch({
    type: SET_PROJECT_LOADING,
  });

  try {
    await axios.delete(`/api/testing/projects/${id}`);

    dispatch({
      type: PROJECT_DELETED,
      payload: id,
    });

    dispatch(setAlert('Project removed', 'success'));
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete a testcase for a project
export const deleteTestcaseForProject = (projectId, testCaseId) => async (
  dispatch
) => {
  dispatch({
    type: SET_PROJECT_LOADING,
  });

  try {
    const res = await axios.delete(
      `/api/testing/projects/testcase/${projectId}/${testCaseId}`
    );

    dispatch({
      type: PROJECT_TESTCASE_DELETED,
      payload: res.data,
    });

    dispatch(setAlert('Test case removed', 'success'));
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete an offer for a project
export const deleteOfferForProject = (projectId, offerId) => async (
  dispatch
) => {
  dispatch({
    type: SET_PROJECT_LOADING,
  });

  try {
    const res = await axios.delete(
      `/api/testing/projects/offer/${projectId}/${offerId}`
    );

    dispatch({
      type: PROJECT_OFFER_DELETED,
      payload: res.data,
    });

    dispatch(setAlert('Offer removed', 'success'));
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete comment on project
export const deleteCommentOnProject = (projectId, commentId) => async (
  dispatch
) => {
  dispatch({
    type: SET_PROJECT_LOADING,
  });

  try {
    const res = await axios.delete(
      `/api/testing/projects/comment/${projectId}/${commentId}`
    );

    dispatch({
      type: COMMENT_REMOVED_PROJECT,
      payload: res.data,
    });

    dispatch(setAlert('Comment removed', 'success'));
  } catch (err) {
    dispatch({
      type: PROJECT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
