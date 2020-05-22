import axios from 'axios';
import {
  ALL_GROUPS_LOADED,
  ALL_GROUPS_LOADED_FOR_USER,
  GROUP_LOADED,
  GROUP_CREATED,
  GROUP_UPDATED,
  GROUP_REQUEST_SENT,
  GROUP_MEMBER_ADDED,
  GROUP_REQUEST_DELETED,
  GROUP_MEMBER_REMOVED,
  GROUP_DELETED,
  GROUP_ERROR
} from '../types';
import { setAlert } from '../alert';

// Get all groups
export const getAllGroups = () => async dispatch => {
  try {
    const res = await axios.get('/api/community/groups');

    dispatch({
      type: ALL_GROUPS_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: GROUP_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get all groups for user
export const getAllGroupsForUser = () => async dispatch => {
  try {
    const res = await axios.get('/api/community/groups/user');

    dispatch({
      type: ALL_GROUPS_LOADED_FOR_USER,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: GROUP_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get group by id
export const getGroupById = id => async dispatch => {
  try {
    const res = await axios.get(`/api/community/groups/${id}`);

    dispatch({
      type: GROUP_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: GROUP_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Create a new group
export const createGroup = (formData, history) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const res = await axios.post('/api/community/groups', formData, config);

    dispatch({
      type: GROUP_CREATED,
      payload: res.data
    });

    dispatch(setAlert('Group created', 'success'));

    history.push('/community/my-groups');
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: GROUP_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Send join request for a group
export const sendJoinRequest = groupId => async dispatch => {
  try {
    const res = await axios.put(`/api/community/groups/request/${groupId}`);

    dispatch({
      type: GROUP_REQUEST_SENT,
      payload: res.data
    });

    dispatch(setAlert('Group request sent', 'success'));
  } catch (err) {
    dispatch({
      type: GROUP_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Add member to group
export const addMemberToGroup = (groupId, userId) => async dispatch => {
  try {
    const res = await axios.put(`/api/community/groups/${groupId}/${userId}`);

    dispatch({
      type: GROUP_MEMBER_ADDED,
      payload: res.data
    });

    dispatch(setAlert('Group member added', 'success'));
  } catch (err) {
    dispatch({
      type: GROUP_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Update a group
export const updateGroup = (formData, id, history) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const res = await axios.put(
      `/api/community/groups/${id}`,
      formData,
      config
    );

    dispatch({
      type: GROUP_UPDATED,
      payload: res.data
    });

    dispatch(setAlert('Group updated', 'success'));

    history.push('/community/my-groups');
  } catch (err) {
    const errors = err.response.data.errors;

    if (err.response.data.errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: GROUP_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Delete a group
export const deleteGroup = id => async dispatch => {
  try {
    await axios.delete(`/api/community/groups/${id}`);

    dispatch({
      type: GROUP_DELETED,
      payload: id
    });

    dispatch(setAlert('Group removed', 'success'));
  } catch (err) {
    dispatch({
      type: GROUP_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Delete join request for group
export const deleteJoinRequest = (groupId, requestId) => async dispatch => {
  try {
    const res = await axios.delete(
      `/api/community/groups/request/${groupId}/${requestId}`
    );

    dispatch({
      type: GROUP_REQUEST_DELETED,
      payload: res.data
    });

    dispatch(setAlert('Group request deleted', 'success'));
  } catch (err) {
    dispatch({
      type: GROUP_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Remove member from group
export const removeMemberFromGroup = (groupId, userId) => async dispatch => {
  try {
    const res = await axios.delete(
      `/api/community/groups/${groupId}/${userId}`
    );

    dispatch({
      type: GROUP_MEMBER_REMOVED,
      payload: res.data
    });

    dispatch(setAlert('Group member removed', 'success'));
  } catch (err) {
    dispatch({
      type: GROUP_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Search for a group
export const searchGroup = description => async dispatch => {
  try {
    const res = await axios.get(`/api/community/groups/search/${description}`);

    dispatch({
      type: ALL_GROUPS_LOADED,
      payload: res.data
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: GROUP_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};
