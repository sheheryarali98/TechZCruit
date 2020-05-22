import axios from 'axios';
import {
  All_STORES_LOADED,
  All_STORES_LOADED_FOR_CURRENT_USER,
  STORE_LOADED,
  STORE_CREATED,
  STORE_UPDATED,
  STORE_REMOVED,
  STORE_ERROR
} from '../types';
import { setAlert } from '../alert';

// Get all stores
export const getAllStores = () => async dispatch => {
  try {
    const res = await axios.get('/api/ecommerce/stores');

    dispatch({
      type: All_STORES_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: STORE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Search for a store
export const searchStore = description => async dispatch => {
  try {
    const res = await axios.get(`/api/ecommerce/stores/search/${description}`);

    dispatch({
      type: All_STORES_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: STORE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get all stores for current user
export const getAllStoresForCurrentUser = () => async dispatch => {
  try {
    const res = await axios.get('/api/ecommerce/stores/user');

    dispatch({
      type: All_STORES_LOADED_FOR_CURRENT_USER,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: STORE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get store by id
export const getStoreById = id => async dispatch => {
  try {
    const res = await axios.get(`/api/ecommerce/stores/${id}`);

    dispatch({
      type: STORE_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: STORE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Create a new store
export const createStore = (formData, history) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const res = await axios.post('/api/ecommerce/stores', formData, config);

    dispatch({
      type: STORE_CREATED,
      payload: res.data
    });

    dispatch(setAlert('Store created', 'success'));

    history.push('/ecommerce/my-stores');
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: STORE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Update a store
export const updateStore = (formData, id, history) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const res = await axios.put(
      `/api/ecommerce/stores/${id}`,
      formData,
      config
    );

    dispatch({
      type: STORE_UPDATED,
      payload: res.data
    });

    dispatch(setAlert('Store updated', 'success'));

    history.push('/ecommerce/my-stores');
  } catch (err) {
    const errors = err.response.data.errors;

    if (err.response.data.errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: STORE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Delete a store
export const deleteStore = id => async dispatch => {
  try {
    await axios.delete(`/api/ecommerce/stores/${id}`);

    dispatch({
      type: STORE_REMOVED,
      payload: id
    });

    dispatch(setAlert('Store removed', 'success'));
  } catch (err) {
    dispatch({
      type: STORE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};
