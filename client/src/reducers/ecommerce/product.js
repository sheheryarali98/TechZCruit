import {
  PRODUCT_CREATED,
  PRODUCT_PURCHASED,
  PRODUCT_LOADED,
  REVIEW_ADDED_PRODUCT,
  PRODUCT_UPDATED,
  PRODUCT_REMOVED,
  PRODUCT_ERROR,
  All_PRODUCTS_LOADED_FOR_STORE,
  REVIEW_REMOVED_PRODUCT,
  PRODUCT_LIKED,
  PRODUCT_UNLIKED,
  All_PRODUCTS_LOADED
} from '../../actions/types';

const initialState = {
  product: null,
  loading: true,
  errors: null,
  products: []
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case All_PRODUCTS_LOADED_FOR_STORE:
    case All_PRODUCTS_LOADED:
      return {
        ...state,
        loading: false,
        errors: null,
        products: payload
      };
    case PRODUCT_CREATED:
      return {
        ...state,
        loading: false,
        errors: null,
        products: [...state.products, payload]
      };
    case PRODUCT_LOADED:
    case PRODUCT_UPDATED:
      return {
        ...state,
        product: payload,
        loading: false,
        errors: null
      };
    case REVIEW_ADDED_PRODUCT:
    case REVIEW_REMOVED_PRODUCT:
      return {
        ...state,
        loading: false,
        errors: null,
        product: { ...state.product, reviews: payload.reviews }
      };
    case PRODUCT_ERROR:
      return {
        ...state,
        loading: false,
        errors: payload
      };
    case PRODUCT_PURCHASED:
      return {
        ...state,
        product: { ...state.product, sales: payload.sales },
        loading: false,
        errors: null
      };
    case PRODUCT_LIKED:
    case PRODUCT_UNLIKED:
      return {
        ...state,
        loading: false,
        errors: null,
        product: { ...state.product, likes: payload.likes }
      };
    case PRODUCT_REMOVED:
      return {
        ...state,
        loading: false,
        errors: null,
        products: [...state.products.filter(product => product._id !== payload)]
      };
    default:
      return state;
  }
}
