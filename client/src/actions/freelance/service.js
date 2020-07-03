import axios from 'axios';
import {
  All_SERVICES_LOADED,
  All_SERVICES_LOADED_FOR_CURRENT_USER,
  SERVICE_LOADED,
  SERVICE_CREATED,
  SERVICE_UPDATED,
  SERVICE_REQUEST_SENT,
  SERVICE_SERVICE_ADDED,
  SERVICE_SERVICE_FINISHED,
  REVIEW_ADDED_SERVICE,
  REVIEW_REMOVED_SERVICE,
  SERVICE_REQUEST_REMOVED,
  SERVICE_REMOVED,
  SERVICE_ERROR,
  SET_SERVICE_LOADING,
} from '../../actions/types';
import { setAlert } from '../../actions/alert';

// Get all services
export const getAllServices = () => async (dispatch) => {
  dispatch({
    type: SET_SERVICE_LOADING,
  });

  try {
    const res = await axios.get('/api/freelance/services');

    dispatch({
      type: All_SERVICES_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: SERVICE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Search for a service
export const searchService = (description) => async (dispatch) => {
  dispatch({
    type: SET_SERVICE_LOADING,
  });

  try {
    const res = await axios.get(
      `/api/freelance/services/search/${description}`
    );

    dispatch({
      type: All_SERVICES_LOADED,
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: SERVICE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get service by id
export const getServiceById = (id) => async (dispatch) => {
  dispatch({
    type: SET_SERVICE_LOADING,
  });

  try {
    const res = await axios.get(`/api/freelance/services/${id}`);

    dispatch({
      type: SERVICE_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: SERVICE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get services for current user
export const getAllServicesForCurrentUser = () => async (dispatch) => {
  dispatch({
    type: SET_SERVICE_LOADING,
  });

  try {
    const res = await axios.get('/api/freelance/services/user');

    dispatch({
      type: All_SERVICES_LOADED_FOR_CURRENT_USER,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: SERVICE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Create a new service
export const createService = (formData, history) => async (dispatch) => {
  dispatch({
    type: SET_SERVICE_LOADING,
  });

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const res = await axios.post('/api/freelance/services', formData, config);

    dispatch({
      type: SERVICE_CREATED,
      payload: res.data,
    });

    dispatch(setAlert('Service created', 'success'));

    history.push('/freelance/my-services');
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: SERVICE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Add service to service
export const addServiceToService = (serviceId, requestId) => async (
  dispatch
) => {
  dispatch({
    type: SET_SERVICE_LOADING,
  });

  try {
    const res = await axios.put(
      `/api/freelance/services/${serviceId}/${requestId}`
    );

    dispatch({
      type: SERVICE_SERVICE_ADDED,
      payload: res.data,
    });

    dispatch(setAlert('Service added', 'success'));
  } catch (err) {
    dispatch({
      type: SERVICE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Finish service for a service
export const finishServiceForService = (id, serviceId) => async (dispatch) => {
  dispatch({
    type: SET_SERVICE_LOADING,
  });

  try {
    const res = await axios.put(
      `/api/freelance/services/finish/${id}/${serviceId}`
    );

    dispatch({
      type: SERVICE_SERVICE_FINISHED,
      payload: res.data,
    });

    dispatch(setAlert('Service finished', 'success'));
  } catch (err) {
    dispatch({
      type: SERVICE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Review on service
export const reviewOnService = (id, formData) => async (dispatch) => {
  dispatch({
    type: SET_SERVICE_LOADING,
  });

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const res = await axios.put(
      `/api/freelance/services/review/${id}`,
      formData,
      config
    );

    dispatch({
      type: REVIEW_ADDED_SERVICE,
      payload: res.data,
    });

    dispatch(setAlert('Review added', 'success'));
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
  }
};

// Update a service
export const updateService = (id, formData, history) => async (dispatch) => {
  dispatch({
    type: SET_SERVICE_LOADING,
  });

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const res = await axios.put(
      `/api/freelance/services/${id}`,
      formData,
      config
    );

    dispatch({
      type: SERVICE_UPDATED,
      payload: res.data,
    });

    dispatch(setAlert('Service updated', 'success'));

    history.push('/freelance/my-services');
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: SERVICE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Send request for service
export const sendRequestForService = (
  id,
  description,
  amount,
  paymentMethodId
) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ description, amount, paymentMethodId });

  try {
    const res = await axios.put(
      `/api/freelance/services/request/${id}`,
      body,
      config
    );

    dispatch({
      type: SERVICE_REQUEST_SENT,
      payload: res.data,
    });

    dispatch(setAlert('Request sent', 'success'));
  } catch (err) {
    dispatch({
      type: SERVICE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete a service
export const deleteService = (id) => async (dispatch) => {
  dispatch({
    type: SET_SERVICE_LOADING,
  });

  try {
    await axios.delete(`/api/freelance/services/${id}`);

    dispatch({
      type: SERVICE_REMOVED,
      payload: id,
    });

    dispatch(setAlert('Service removed', 'success'));
  } catch (err) {
    dispatch({
      type: SERVICE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete a request for a service
export const deleteRequestForService = (serviceId, requestId) => async (
  dispatch
) => {
  dispatch({
    type: SET_SERVICE_LOADING,
  });

  try {
    const res = await axios.delete(
      `/api/freelance/services/request/${serviceId}/${requestId}`
    );

    dispatch({
      type: SERVICE_REQUEST_REMOVED,
      payload: res.data,
    });

    dispatch(setAlert('Request removed', 'success'));
  } catch (err) {
    dispatch({
      type: SERVICE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete review on service
export const deleteReviewOnService = (serviceId, reviewId) => async (
  dispatch
) => {
  dispatch({
    type: SET_SERVICE_LOADING,
  });

  try {
    const res = await axios.delete(
      `/api/freelance/services/review/${serviceId}/${reviewId}`
    );

    dispatch({
      type: REVIEW_REMOVED_SERVICE,
      payload: res.data,
    });

    dispatch(setAlert('Review removed', 'success'));
  } catch (err) {
    console.log(err);
    dispatch({
      type: SERVICE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
