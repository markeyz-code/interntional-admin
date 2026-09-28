import { GATEWAY_ENDPOINT, GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const authApi = {
  // Regular user login (not used by admin)
  login(data: { email: string; password: string }) {
    return GATEWAY_ENDPOINT.post('/auth/login', data);
  },

  // ── Admin-specific auth ──────────────────────────────────────
  /** Step 1: Validate credentials, trigger OTP email */
  adminLogin(data: { email: string; password: string }) {
    return GATEWAY_ENDPOINT.post('/auth/admin/login', data);
  },
  /** Step 2: Submit OTP → receive JWT */
  adminVerifyOtp(data: { email: string; otp: string }) {
    return GATEWAY_ENDPOINT.post('/auth/admin/verify-otp', data);
  },
  /** Step 3: Resend OTP */
  adminResendOtp(data: { email: string }) {
    return GATEWAY_ENDPOINT.post('/auth/admin/resend-otp', data);
  },
  /** Request password reset email */
  adminForgotPassword(data: { email: string }) {
    return GATEWAY_ENDPOINT.post('/auth/admin/forgot-password', data);
  },
  /** Reset password using token from email */
  adminResetPassword(data: { token: string; password: string }) {
    return GATEWAY_ENDPOINT.post('/auth/admin/reset-password', data);
  },
  // ────────────────────────────────────────────────────────────

  me() {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/auth/me');
  },
};
