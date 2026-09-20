import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const storageApi = {
  /**
   * Request a Cloudinary upload signature from the backend.
   * Returns { timestamp, signature, folder, cloudName, apiKey }
   */
  getUploadSignature(data: { folder: string }) {
    return GATEWAY_ENDPOINT_WITH_AUTH.post('/storage/signature', data);
  },
};
