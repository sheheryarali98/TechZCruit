import {
  ALL_POSTS_LOADED,
  POST_ADDED,
  POST_REMOVED,
  POST_ERROR,
  POST_LIKED,
  POST_UNLIKED,
  POST_LOADED,
  COMMENT_ADDED,
  COMMENT_REMOVED,
  COMMENT_ERROR
} from "../types";
import { setAlert } from "../alert";
import axios from "axios";

// Get all posts
export const getAllPosts = groupId => async dispatch => {
  try {
    const res = await axios.get(`/api/community/posts/group/${groupId}`);

    dispatch({
      type: ALL_POSTS_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get post by id
export const getPostById = postId => async dispatch => {
  try {
    const res = await axios.get(`/api/community/posts/${postId}`);

    dispatch({
      type: POST_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Create new post
export const createNewPost = (groupId, formData) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  try {
    const res = await axios.post(
      `/api/community/posts/${groupId}`,
      formData,
      config
    );

    dispatch({
      type: POST_ADDED,
      payload: res.data
    });

    dispatch(setAlert("Post Added", "success"));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }
  }
};

// Delete post
export const deletePost = postId => async dispatch => {
  try {
    await axios.delete(`/api/community/posts/${postId}`);

    dispatch({
      type: POST_REMOVED,
      payload: postId
    });

    dispatch(setAlert("Post Removed", "success"));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }
  }
};

// Like post
export const likePost = postId => async dispatch => {
  try {
    const res = await axios.put(`/api/community/posts/like/${postId}`);

    dispatch({
      type: POST_LIKED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Unlike post
export const unlikePost = postId => async dispatch => {
  try {
    const res = await axios.put(`/api/community/posts/unlike/${postId}`);

    dispatch({
      type: POST_UNLIKED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Comment on post
export const addComment = (postId, formData) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  try {
    const res = await axios.post(
      `/api/community/posts/comment/${postId}`,
      formData,
      config
    );

    dispatch({
      type: COMMENT_ADDED,
      payload: res.data
    });

    dispatch(setAlert("Comment added", "success"));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }
  }
};

// Delete comment on post
export const deleteComment = (postId, commentId) => async dispatch => {
  try {
    const res = await axios.delete(
      `/api/community/posts/comment/${postId}/${commentId}`
    );

    dispatch({
      type: COMMENT_REMOVED,
      payload: res.data
    });

    dispatch(setAlert("Comment removed", "success"));
  } catch (err) {
    dispatch({
      type: COMMENT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};
