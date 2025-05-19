const API_ENDPOINTS = {
    AUTH: {
      SEND_OTP:'auth/send-otp',
      VERIFY_OTP:'auth/verify-otp',
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
    },
    USER: {
      PROFILE: '/profile',
      UPDATE_PROFILE: '/users/me',
      CHANGE_PASSWORD: '/users/change-password',
    },
    PRODUCTS: {
      LIST: '/products',
      DETAIL: (id) => `/products/${id}`,
    },
  };
  
  export default API_ENDPOINTS;