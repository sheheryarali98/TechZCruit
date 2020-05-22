import axios from 'axios';
import {
  All_CAMPAIGNS_LOADED,
  All_CAMPAIGNS_LOADED_FOR_USER,
  CAMPAIGN_LOADED,
  CAMPAIGN_CREATED,
  CAMPAIGN_UPDATED,
  CAMPAIGN_SUPPORTED,
  COMMENT_ADDED_CAMPAIGN,
  COMMENT_REMOVED_CAMPAIGN,
  CAMPAIGN_DELETED,
  CAMPAIGN_ERROR
} from '../types';
import { setAlert } from '../alert';

// Get all campaigns
export const getAllCampaigns = () => async dispatch => {
  try {
    const res = await axios.get('/api/crowdfunding/campaigns');

    dispatch({
      type: All_CAMPAIGNS_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: CAMPAIGN_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get all campaigns for user
export const getAllCampaignsForUser = () => async dispatch => {
  try {
    const res = await axios.get('/api/crowdfunding/campaigns/user');

    dispatch({
      type: All_CAMPAIGNS_LOADED_FOR_USER,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: CAMPAIGN_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

//  Get campaign by id
export const getCampaignById = id => async dispatch => {
  try {
    const res = await axios.get(`/api/crowdfunding/campaigns/${id}`);

    dispatch({
      type: CAMPAIGN_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: CAMPAIGN_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Search for a campaign
export const searchCampaign = description => async dispatch => {
  try {
    const res = await axios.get(
      `/api/crowdfunding/campaigns/search/${description}`
    );

    dispatch({
      type: All_CAMPAIGNS_LOADED,
      payload: res.data
    });
  } catch (err) {
    console.log(err);
    dispatch({
      type: CAMPAIGN_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Create campaign
export const createCampaign = (formData, history) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const res = await axios.post(
      '/api/crowdfunding/campaigns',
      formData,
      config
    );

    dispatch({
      type: CAMPAIGN_CREATED,
      payload: res.data
    });

    dispatch(setAlert('Campaign created', 'success'));

    history.push('/crowdfunding/my-campaigns');
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
  }
};

// Comment on campaign
export const addCommentOnCampaign = (id, formData) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const res = await axios.put(
      `/api/crowdfunding/campaigns/comment/${id}`,
      formData,
      config
    );

    dispatch({
      type: COMMENT_ADDED_CAMPAIGN,
      payload: res.data
    });

    dispatch(setAlert('Comment added', 'success'));
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
  }
};

// Support a campaign
export const supportCampaign = (campaignId, amount) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const body = JSON.stringify({ amount });

  try {
    const res = await axios.put(
      `/api/crowdfunding/campaigns/support/${campaignId}`,
      body,
      config
    );

    dispatch({
      type: CAMPAIGN_SUPPORTED,
      payload: res.data.campaign
    });

    dispatch(setAlert('Campaign supported', 'success'));

    return res.data.clientSecret;
  } catch (err) {
    dispatch({
      type: CAMPAIGN_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Update a campaign
export const updateCampaign = (id, formData, history) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const res = await axios.put(
      `/api/crowdfunding/campaigns/${id}`,
      formData,
      config
    );

    dispatch({
      type: CAMPAIGN_UPDATED,
      payload: res.data
    });

    dispatch(setAlert('Campaign updated', 'success'));

    history.push('/crowdfunding/my-campaigns');
  } catch (err) {
    dispatch({
      type: CAMPAIGN_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Delete a campaign
export const deleteCampaign = id => async dispatch => {
  try {
    const res = await axios.delete(`/api/crowdfunding/campaigns/${id}`);

    dispatch({
      type: CAMPAIGN_DELETED,
      payload: id
    });

    dispatch(setAlert(res.data.msg, 'success'));
  } catch (err) {
    dispatch({
      type: CAMPAIGN_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Delete comment on campaign
export const deleteCommentOnCampaign = (
  campaignId,
  commentId
) => async dispatch => {
  try {
    const res = await axios.delete(
      `/api/crowdfunding/campaigns/comment/${campaignId}/${commentId}`
    );

    dispatch({
      type: COMMENT_REMOVED_CAMPAIGN,
      payload: res.data
    });

    dispatch(setAlert('Comment removed', 'success'));
  } catch (err) {
    dispatch({
      type: CAMPAIGN_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};
