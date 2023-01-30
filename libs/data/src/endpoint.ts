export const PASSWORD_LOGIN_ENDPOINT = "api/v3/auth/sign_in";
export const PASSWORD_REGISTER_ENDPOINT = "api/v3/auth/sign_up";
export const GET_CURRENT_USER_ENDPOINT = "api/v3/users/current_user";
export const FORGOT_PASSWORD_ENDPOINT = "api/v3/auth/forgot_password";
export const RESET_PASSWORD_ENDPOINT = "api/v3/auth/reset_password";
export const LOGOUT_ENDPOINT = "api/v3/auth/logout";
export const VERIFY_ENDPOINT = "api/v3/auth/verify";
export const PRODUCT_ENDPOINT = "api/v3/products";
export const GET_LIST_TAXONS_ENDPOINT = "api/v3/taxons";
export const SEARCH_KEYWORD_ENDPOINT = "/api/v3/search_keys";
export const SEARCH_PRODUCT_ENDPOINT = "/api/v3/products/search";
export const GET_PAGE_DATA_ENDPOINT = "/api/v3/footer";
export const SUBSCRIPTION_ENDPOINT = "api/v3/subscription";
export const GET_HOME_PAGE_DATA_ENDPOINT = "/api/v3/page_data/homepage";
export const GET_LIST_BRAND_ENDPOINT = "/api/v3/brands";
export const GET_LIST_CATEGORY_ENDPOINT = "/api/v3/taxons";
export const UPDATE_PROFILE_ENDPOINT = "/api/v3/users";
export const GET_CURRENT_ORDER_ENDPOINT = "/api/v3/users/current_order";
export const GET_SHOPPING_CART_ENDPOINT = "/api/v3/orders/:orderNumber";
export const DELETE_SHOPPING_CART_ITEM_ENDPOINT =
  GET_SHOPPING_CART_ENDPOINT + "/remove_line_item/:id";
export const APPLY_PROMOTION_ENDPOINT =
  GET_SHOPPING_CART_ENDPOINT + "/apply_promo";
export const REMOVE_PROMOTION_ENDPOINT =
  GET_SHOPPING_CART_ENDPOINT + "/rollback";
export const SELECT_SHIPPING_AND_BILLING_ADDRESS =
  GET_SHOPPING_CART_ENDPOINT + "/select_address";
export const ESTIMATE_SHIPPING_COST_ENDPOINT =
  GET_SHOPPING_CART_ENDPOINT + "/estimate_shipping_cost";
export const UPDATE_NOTE_ENDPOINT = "/api/v3/orders/:orderNumber";

export const ADD_TO_CART_ENDPOINT = "/api/v3/orders/add_line_item";
export const BASE_WISHLIST_ENDPOINT = "/api/v3/wishlists";
export const GUEST_ADD_TO_CART_ENDPOINT = "/api/v3/orders/guest_add_line_item";
export const GET_CHECKOUT_CART_ENDPOINT =
  GET_SHOPPING_CART_ENDPOINT + "/refresh";
export const SET_SHIPPING_METHOD_ENDPOINT =
  GET_SHOPPING_CART_ENDPOINT + "/add_shipping_method";
export const SET_PAYMENT_METHOD_ENDPOINT =
  GET_SHOPPING_CART_ENDPOINT + "/add_payment";

export const SHIPPING_ADDRESS_ENDPOINT = "/api/v3/shipping_addresses";

export const BASE_ENDPOINT = "/api/v3/";
export const GET_PROVINCES_ENDPOINT = "/api/v3/provinces";
export const GET_WARDS_ENDPOINT = "/api/v3/wards";
export const GET_DISTRICTS_ENDPOINT = "/api/v3/districts";

export const GET_LIST_PAYMENT_METHOD_ENDPOINT = "/api/v3/payment_methods";
export const PROCESS_PAYMENT_ENDPOINT = "/api/v3/payments/:paymentId/process";
export const GET_USER_SHIPPING_ADDRESS_ENDPOINT = "/api/v3/shipping_addresses";
export const GET_ORDERS_ENDPOINT = "/api/v3/orders";
export const BLOG_ENDPONT = "/api/v3/posts";
export const BLOG_ENDPOINT = "/api/v3/posts";
export const PAGE_DATA_ENDPOINT = "/api/v3/posts/page_data";
export const CHANGE_PASSWORD_ENDPOINT = "/api/v3/users/change_password";
export const REACT_COMMENT_ENDPOINT = "/api/v3/comments";
export const PRODUCT_REVIEW_ENDPOINT = "/api/v3/products";
export const CREATE_REVIEW_ENDPOINT = "/api/v3/product";
export const GET_BANNER_DATA_ENDPOINT = "/api/v3/banners";
export const GOOGLE_ENDPOINT = "api/v3/auth/google";
export const GOOGLE_CALLBACK_ENDPOINT = "api/v3/auth/google/callback";
export const PAYMENT_CALLBACK_ENDPOINT = "/api/v3/payments/payment_callback";
export const FACEBOOK_ENDPOINT = "api/v3/auth/facebook";
export const FACEBOOK_CALLBACK_ENDPOINT = "api/v3/auth/facebook/callback";
export const GET_STATIC_PAGE_DATA_ENDPOINT = "/api/v3/static_page/:slug";
export const SALE_EVENT_RUNNING = "api/v3/promotions/running";
export const GET_HOMEPAGE_IN_SHOPPAGE = "/api/v3/shop/homepage";
export const JUST_FOR_YOU_ENDPOINT = "api/v3/products/for_you";
export const GET_SAMPLE = "/api/v3/get_samples";
export const SHOPINSHOP_ENDPOINT = "api/v3/shop/:slug";
export const LIST_PRODUCT_REVIEW_ENDPOINT = "/api/v3/reviews";
export const GET_COLLECTIONS_LIST_ENDPOINT = "api/v3/collections";
export const BACK_TO_CART_ENDPOINT = "api/v3/orders/:orderNumber/back_to_cart";

// ---------- LOYALTY ----------
export const LOYALTY_ENDPOINT = "api/v3/history_update_point";
export const ACTIVE_LOYALTY_ENDPOINT =
  LOYALTY_ENDPOINT + "/check_active_program_reward_point";
export const LOYALTY_EXPIRED_TIME = LOYALTY_ENDPOINT + "/get_expires_at";
// --- IMAGE UPLOAD ---
export const UPLOAD_IMAGE_ENDPOINT = "api/v3/upload";

// --- PRODUCT REVIEW ---
export const REPLY_REVIEW_ENDPOINT = "/api/v3/reply_reviews";
export const PRODUCT_REVIEW_ENDPOINT_3 = "/api/v3/product/:productId/reviews";
export const PRODUCT_REVIEW_ENDPOINT_2 = "/api/v3/reviews";

export const GET_LIST_HASHTAG_REVIEW_ENDPOINT = "api/v3/hashtags";

// GET SAMPLE
export const SUBMIT_SURVEY_FORM_ENDPOINT = "/api/v3/subscribe_surveys";
