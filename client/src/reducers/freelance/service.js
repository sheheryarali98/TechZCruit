import {
  SERVICE_ERROR,
  All_SERVICES_LOADED,
  SERVICE_LOADED,
  REVIEW_ADDED_STORE,
  REVIEW_REMOVED_STORE,
  SERVICE_REQUEST_SENT,
  All_SERVICES_LOADED_FOR_CURRENT_USER,
  SERVICE_CREATED,
  SERVICE_REMOVED,
  SERVICE_UPDATED
} from '../../actions/types';

const initialState = {
  service: null,
  loading: true,
  errors: null,
  services: []
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case All_SERVICES_LOADED_FOR_CURRENT_USER:
    case All_SERVICES_LOADED:
      return {
        ...state,
        loading: false,
        errors: null,
        services: payload
      };
    case SERVICE_LOADED:
    case SERVICE_UPDATED:
      return {
        ...state,
        loading: false,
        errors: null,
        service: payload
      };
    case SERVICE_CREATED:
      return {
        ...state,
        loading: false,
        errors: null,
        services: [...state.services, payload]
      };
    case SERVICE_REMOVED:
      return {
        ...state,
        loading: false,
        errors: null,
        services: [...state.services.filter(item => item._id !== payload)]
      };
    case REVIEW_ADDED_STORE:
    case REVIEW_REMOVED_STORE:
      return {
        ...state,
        loading: false,
        errors: null,
        service: { ...state.service, reviews: payload.reviews }
      };
    case SERVICE_REQUEST_SENT:
      return {
        ...state,
        loading: false,
        errors: null,
        service: { ...state.service, requests: payload.requests }
      };
    case SERVICE_ERROR:
      return {
        ...state,
        loading: false,
        errors: payload
      };
    default:
      return state;
  }
}
