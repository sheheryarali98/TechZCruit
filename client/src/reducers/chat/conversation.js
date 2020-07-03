import {
  ALL_CONVERSATIONS_LOADED,
  CONVERSATION_ERROR,
  CONVERSATION_LOADED,
  MESSAGE_ADDED,
  CONVERSATION_CREATED,
  SET_CONVERSATION_LOADING,
} from '../../actions/types';

const initialState = {
  conversation: null,
  loading: false,
  errors: null,
  conversations: [],
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case ALL_CONVERSATIONS_LOADED:
      return {
        ...state,
        loading: false,
        errors: null,
        conversations: payload,
      };
    case CONVERSATION_LOADED:
    case CONVERSATION_CREATED:
      return {
        ...state,
        loading: false,
        errors: null,
        conversation: payload,
      };
    case MESSAGE_ADDED:
      return {
        ...state,
        loading: false,
        errors: null,
        conversation: { ...state.conversation, messages: payload.messages },
      };
    case CONVERSATION_ERROR:
      return {
        ...state,
        loading: false,
        errors: payload,
      };
    case SET_CONVERSATION_LOADING:
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
}
