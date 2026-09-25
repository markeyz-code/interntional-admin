import { GATEWAY_ENDPOINT_WITH_AUTH, cachedGet } from '../axios.config';

export const eventsApi = {
  getEvents: () => cachedGet('/events'),
  getEvent: (id: string) => cachedGet(`/events/${id}`),
  createEvent: (data: any) => GATEWAY_ENDPOINT_WITH_AUTH.post('/events', data),
  updateEvent: (id: string, data: any) => GATEWAY_ENDPOINT_WITH_AUTH.patch(`/events/${id}`, data),
  deleteEvent: (id: string) => GATEWAY_ENDPOINT_WITH_AUTH.delete(`/events/${id}`),
  getRegistrations: (eventId: string) => cachedGet(`/events/${eventId}/registrations`),
  getRegistrationCounts: () => cachedGet('/events/stats/registration-counts'),
  deleteRegistration: (regId: string) => GATEWAY_ENDPOINT_WITH_AUTH.delete(`/events/registrations/${regId}`),
};
