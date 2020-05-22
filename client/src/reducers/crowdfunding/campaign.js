import {
  CAMPAIGN_CREATED,
  CAMPAIGN_ERROR,
  CAMPAIGN_LOADED,
  COMMENT_ADDED_CAMPAIGN,
  All_CAMPAIGNS_LOADED,
  All_CAMPAIGNS_LOADED_FOR_USER,
  CAMPAIGN_UPDATED,
  CAMPAIGN_DELETED,
  COMMENT_REMOVED_CAMPAIGN,
  CAMPAIGN_SUPPORTED
} from '../../actions/types';

const initialState = {
  campaign: null,
  loading: true,
  errors: null,
  campaigns: []
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case All_CAMPAIGNS_LOADED:
    case All_CAMPAIGNS_LOADED_FOR_USER:
      return {
        ...state,
        campaigns: payload,
        loading: false,
        errors: null
      };
    case CAMPAIGN_CREATED:
      return {
        ...state,
        campaigns: [...state.campaigns, payload],
        loading: false,
        errors: null
      };
    case CAMPAIGN_LOADED:
    case CAMPAIGN_UPDATED:
      return {
        ...state,
        campaign: payload,
        loading: false,
        errors: null
      };
    case CAMPAIGN_DELETED:
      return {
        ...state,
        loading: false,
        errors: null,
        campaigns: [
          ...state.campaigns.filter(campaign => campaign._id !== payload)
        ]
      };
    case COMMENT_ADDED_CAMPAIGN:
    case COMMENT_REMOVED_CAMPAIGN:
      return {
        ...state,
        loading: false,
        errors: null,
        campaign: { ...state.campaign, comments: payload.comments }
      };
    case CAMPAIGN_ERROR:
      return {
        ...state,
        loading: false,
        errors: payload
      };
    case CAMPAIGN_SUPPORTED:
      return {
        ...state,
        loading: false,
        errors: null,
        campaign: { ...state.campaign, supporters: payload.supporters }
      };
    default:
      return state;
  }
}
