import {
  ALL_PROJECTS_LOADED,
  PROJECT_ERROR,
  PROJECT_LOADED,
  PROJECT_OFFER_SENT,
  ALL_PROJECTS_LOADED_FOR_USER,
  PROJECT_DELETED,
  PROJECT_CREATED,
  PROJECT_UPDATED,
  PROJECT_TESTCASE_DELETED,
  PROJECT_TESTCASE_CREATED,
  PROJECT_OFFER_DELETED,
  PROJECT_TESTER_ADDED,
  ALL_ONGOING_PROJECTS_LOADED_FOR_USER,
  PROJECT_TESTING_FINISHED,
  PROJECT_TESTCASE_PASSED,
  PROJECT_TESTCASE_FAILED,
  COMMENT_ADDED_PROJECT,
  COMMENT_REMOVED_PROJECT,
  SET_PROJECT_LOADING,
} from '../../actions/types';

const initialState = {
  project: null,
  loading: true,
  errors: null,
  projects: [],
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case ALL_PROJECTS_LOADED:
    case ALL_PROJECTS_LOADED_FOR_USER:
    case ALL_ONGOING_PROJECTS_LOADED_FOR_USER:
      return {
        ...state,
        projects: payload,
        loading: false,
        errors: null,
      };
    case PROJECT_CREATED:
      return {
        ...state,
        loading: false,
        errors: null,
        projects: [...state.projects, payload],
      };
    case PROJECT_LOADED:
    case PROJECT_UPDATED:
      return {
        ...state,
        project: payload,
        loading: false,
        errors: null,
      };
    case PROJECT_OFFER_SENT:
    case PROJECT_OFFER_DELETED:
      return {
        ...state,
        loading: false,
        errors: null,
        project: { ...state.project, offers: payload.offers },
      };
    case PROJECT_DELETED:
    case PROJECT_TESTING_FINISHED:
      return {
        ...state,
        loading: false,
        errors: null,
        projects: [...state.projects.filter((item) => item._id !== payload)],
      };
    case PROJECT_TESTCASE_CREATED:
    case PROJECT_TESTCASE_DELETED:
      return {
        ...state,
        loading: false,
        errors: null,
        project: { ...state.project, testCases: payload.testCases },
      };
    case PROJECT_TESTER_ADDED:
      return {
        ...state,
        loading: false,
        errors: null,
        project: { ...state.project, testers: payload.testers },
      };
    case PROJECT_TESTCASE_PASSED:
    case PROJECT_TESTCASE_FAILED:
      return {
        ...state,
        loading: false,
        errors: null,
        project: { ...state.project, testCases: payload.testCases },
      };
    case COMMENT_ADDED_PROJECT:
    case COMMENT_REMOVED_PROJECT:
      return {
        ...state,
        loading: false,
        errors: null,
        project: { ...state.project, comments: payload.comments },
      };
    case PROJECT_ERROR:
      return {
        ...state,
        loading: false,
        errors: payload,
      };
    case SET_PROJECT_LOADING:
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
}
