import {
  ALL_GROUPS_LOADED,
  GROUP_ERROR,
  ALL_GROUPS_LOADED_FOR_USER,
  GROUP_CREATED,
  GROUP_LOADED,
  GROUP_UPDATED,
  GROUP_DELETED,
  GROUP_REQUEST_SENT,
  GROUP_REQUEST_DELETED,
  GROUP_MEMBER_ADDED,
  GROUP_MEMBER_REMOVED,
  SET_GROUP_LOADING,
} from '../../actions/types';

const initialState = {
  group: null,
  loading: true,
  errors: null,
  groups: [],
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case ALL_GROUPS_LOADED:
    case ALL_GROUPS_LOADED_FOR_USER:
      return {
        ...state,
        groups: payload,
        loading: false,
        errors: null,
      };
    case GROUP_LOADED:
    case GROUP_UPDATED:
      return {
        ...state,
        group: payload,
        loading: false,
        errors: null,
      };
    case GROUP_CREATED:
      return {
        ...state,
        groups: [...state.groups, payload],
        loading: false,
        errors: null,
      };
    case GROUP_DELETED:
      return {
        ...state,
        loading: false,
        errors: null,
        groups: [...state.groups.filter((group) => group._id !== payload)],
      };
    case GROUP_REQUEST_SENT:
      return {
        ...state,
        loading: false,
        errors: null,
        groups: [
          ...state.groups.map((group) =>
            group._id === payload._id
              ? { ...group, requests: payload.requests }
              : group
          ),
        ],
      };
    case GROUP_REQUEST_DELETED:
      return {
        ...state,
        loading: false,
        errors: null,
        group: { ...state.group, requests: payload.requests },
      };
    case GROUP_MEMBER_ADDED:
    case GROUP_MEMBER_REMOVED:
      return {
        ...state,
        loading: false,
        errors: null,
        group: { ...state.group, members: payload.members },
      };
    case GROUP_ERROR:
      return {
        ...state,
        loading: false,
        errors: payload,
      };
    case SET_GROUP_LOADING:
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
}
