import {
  All_STORES_LOADED_FOR_CURRENT_USER,
  STORE_ERROR,
  STORE_REMOVED,
  STORE_CREATED,
  STORE_LOADED,
  STORE_UPDATED,
  All_STORES_LOADED,
  SET_STORE_LOADING,
} from '../../actions/types';

const initialState = {
  store: null,
  loading: true,
  errors: null,
  stores: [],
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case All_STORES_LOADED_FOR_CURRENT_USER:
    case All_STORES_LOADED:
      return {
        ...state,
        loading: false,
        errors: null,
        stores: payload,
      };
    case STORE_LOADED:
    case STORE_UPDATED:
      return {
        ...state,
        loading: false,
        errors: null,
        store: payload,
      };
    case STORE_CREATED:
      return {
        ...state,
        loading: false,
        errors: null,
        stores: [...state.stores, payload],
      };
    case STORE_REMOVED:
      return {
        ...state,
        loading: false,
        errors: null,
        stores: [...state.stores.filter((store) => store._id !== payload)],
      };
    case STORE_ERROR:
      return {
        ...state,
        loading: false,
        errors: payload,
      };
    case SET_STORE_LOADING:
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
}
