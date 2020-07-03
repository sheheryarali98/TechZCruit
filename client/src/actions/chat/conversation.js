import axios from 'axios';
import {
  ALL_CONVERSATIONS_LOADED,
  CONVERSATION_LOADED,
  CONVERSATION_CREATED,
  MESSAGE_ADDED,
  CONVERSATION_ERROR,
  SET_CONVERSATION_LOADING,
} from '../types';

// Get all conversations for user
export const getAllConversationsForCurrentUser = () => async (dispatch) => {
  dispatch({
    type: SET_CONVERSATION_LOADING,
  });

  try {
    const res = await axios.get('/api/chat/conversations/user');

    dispatch({
      type: ALL_CONVERSATIONS_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: CONVERSATION_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get conversation by id
export const getConversationById = (id) => async (dispatch) => {
  dispatch({
    type: SET_CONVERSATION_LOADING,
  });

  try {
    const res = await axios.get(`/api/chat/conversations/${id}`);

    dispatch({
      type: CONVERSATION_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: CONVERSATION_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Create a conversation
export const createConversation = (user1, user2) => async (dispatch) => {
  dispatch({
    type: SET_CONVERSATION_LOADING,
  });

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ user1, user2 });

  try {
    const res = await axios.post('/api/chat/conversations', body, config);

    dispatch({
      type: CONVERSATION_CREATED,
      payload: res.data,
    });

    return res.data._id;
  } catch (err) {
    dispatch({
      type: CONVERSATION_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Add a message
export const addMessage = (conversation) => (dispatch) => {
  dispatch({
    type: MESSAGE_ADDED,
    payload: conversation,
  });
};
