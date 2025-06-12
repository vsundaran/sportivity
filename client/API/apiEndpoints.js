const API_ENDPOINTS = {
  AUTH: {
    SEND_OTP: 'auth/send-otp',
    VERIFY_OTP: 'auth/verify-otp',
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  USER: {
    PROFILE: '/profile',
  },
  SKILLS: {
    USER_SKILL: '/user-skill',
    GET_SKILLS: '/game-skills',
  },
  ACTIVITY: {
    CREATE_ACTIVITY: '/activity',
    GET_ACTIVITIES: '/activity',
  },
  PLAYERS: {
    GET_PLAYERS: '/users'
  }
};

export default API_ENDPOINTS;