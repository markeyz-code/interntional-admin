import { GATEWAY_ENDPOINT_WITH_AUTH, cachedGet } from '../axios.config';

export const usersApi = {
  /** Get all pending users */
  getPendingUsers() {
    return cachedGet('/users/pending');
  },

  /** Approve a user – starts their 24-month timer */
  approveUser(id: string) {
    return GATEWAY_ENDPOINT_WITH_AUTH.patch(`/users/${id}/approve`);
  },

  /** Reject a user's application */
  rejectUser(id: string) {
    return GATEWAY_ENDPOINT_WITH_AUTH.patch(`/users/${id}/reject`);
  },

  /** Get all approved active users */
  getApprovedUsers() {
    return cachedGet('/users/approved');
  },

  /** Revoke access for an approved user */
  revokeUser(id: string) {
    return GATEWAY_ENDPOINT_WITH_AUTH.patch(`/users/${id}/revoke`);
  },
};
