import { api } from '../api/axios';

export const getEventById = async (eventId: string) => {
  return await api.get(`/events/${eventId}`);
};
