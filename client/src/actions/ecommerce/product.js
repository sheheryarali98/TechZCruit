import axios from 'axios';
import {
  All_PRODUCTS_LOADED,
  All_PRODUCTS_LOADED_FOR_STORE,
  PRODUCT_LOADED,
  PRODUCT_CREATED,
  PRODUCT_UPDATED,
  PRODUCT_LIKED,
  PRODUCT_UNLIKED,
  PRODUCT_PURCHASED,
  REVIEW_ADDED_PRODUCT,
  REVIEW_REMOVED_PRODUCT,
  PRODUCT_REMOVED,
  PRODUCT_ERROR
} from '../types';
import { setAlert } from '../alert';

//  Get Product by id
export const getProductById = id => async dispatch => {
  try {
    const res = await axios.get(`/api/ecommerce/products/${id}`);

    dispatch({
      type: PRODUCT_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get all products
export const getAllProducts = () => async dispatch => {
  try {
    const res = await axios.get('/api/ecommerce/products');

    dispatch({
      type: All_PRODUCTS_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get all products for a store
export const getAllProductsForStore = storeId => async dispatch => {
  try {
    const res = await axios.get(`/api/ecommerce/products/store/${storeId}`);

    dispatch({
      type: All_PRODUCTS_LOADED_FOR_STORE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Search for a product
export const searchProduct = description => async dispatch => {
  try {
    const res = await axios.get(
      `/api/ecommerce/products/search/${description}`
    );

    dispatch({
      type: All_PRODUCTS_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Create a product
export const createProduct = (storeId, formData, history) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const res = await axios.post(
      `/api/ecommerce/products/${storeId}`,
      formData,
      config
    );

    dispatch({
      type: PRODUCT_CREATED,
      payload: res.data
    });

    dispatch(setAlert('Product created', 'success'));

    history.push(`/ecommerce/store/products/${storeId}`);
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
  }
};

// Purchase a product
export const purchaseProduct = (productId, amount) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const body = JSON.stringify({ amount });

  try {
    const res = await axios.put(
      `/api/ecommerce/products/purchase/${productId}`,
      body,
      config
    );

    dispatch({
      type: PRODUCT_PURCHASED,
      payload: res.data.product
    });

    dispatch(setAlert('Product purchased', 'success'));

    return res.data.clientSecret;
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Like a Product
export const likeProduct = productId => async dispatch => {
  try {
    const res = await axios.put(`/api/ecommerce/products/like/${productId}`);

    dispatch({
      type: PRODUCT_LIKED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

//Unlike a product
export const unlikeProduct = productId => async dispatch => {
  try {
    const res = await axios.put(`/api/ecommerce/products/unlike/${productId}`);

    dispatch({
      type: PRODUCT_UNLIKED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Update a product
export const updateProduct = (
  storeId,
  productId,
  formData,
  history
) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const res = await axios.put(
      `/api/ecommerce/products/${productId}`,
      formData,
      config
    );

    dispatch({
      type: PRODUCT_UPDATED,
      payload: res.data
    });

    dispatch(setAlert('Product updated', 'success'));

    history.push(`/ecommerce/store/products/${storeId}`);
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
  }
};

// Add a review to a product
export const reviewOnProduct = (productId, formData) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const res = await axios.put(
      `/api/ecommerce/products/review/${productId}`,
      formData,
      config
    );

    dispatch({
      type: REVIEW_ADDED_PRODUCT,
      payload: res.data
    });

    dispatch(setAlert('Review added', 'success'));
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
  }
};

// Delete a review on a product
export const deleteReviewOnProduct = (
  productId,
  reviewId
) => async dispatch => {
  try {
    const res = await axios.delete(
      `/api/ecommerce/products/review/${productId}/${reviewId}`
    );

    dispatch({
      type: REVIEW_REMOVED_PRODUCT,
      payload: res.data
    });

    dispatch(setAlert('Review removed', 'success'));
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Delete a product
export const deleteProduct = productId => async dispatch => {
  try {
    await axios.delete(`/api/ecommerce/products/${productId}`);

    dispatch({
      type: PRODUCT_REMOVED,
      payload: productId
    });

    dispatch(setAlert('Product Removed', 'success'));
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};
