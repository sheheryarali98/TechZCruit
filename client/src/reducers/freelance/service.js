import {
  SERVICE_ERROR,
  All_SERVICES_LOADED,
  SERVICE_LOADED,
  REVIEW_ADDED_SERVICE,
  REVIEW_REMOVED_SERVICE,
  SERVICE_REQUEST_SENT,
  All_SERVICES_LOADED_FOR_CURRENT_USER,
  SERVICE_CREATED,
  SERVICE_REMOVED,
  SERVICE_UPDATED,
  SERVICE_REQUEST_REMOVED,
  SERVICE_SERVICE_ADDED,
  SERVICE_SERVICE_FINISHED
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
    case REVIEW_ADDED_SERVICE:
    case REVIEW_REMOVED_SERVICE:
      return {
        ...state,
        loading: false,
        errors: null,
        service: { ...state.service, reviews: payload.reviews }
      };
    case SERVICE_REQUEST_SENT:
    case SERVICE_REQUEST_REMOVED:
      return {
        ...state,
        loading: false,
        errors: null,
        service: { ...state.service, requests: payload.requests }
      };
    case SERVICE_SERVICE_ADDED:
    case SERVICE_SERVICE_FINISHED:
      return {
        ...state,
        loading: false,
        errors: null,
        service: { ...state.service, services: payload.services }
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
