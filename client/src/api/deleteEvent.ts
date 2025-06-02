import { api } from '../api/axios';

export const deleteEvent = async (eventId: string) => {
  return await api.delete(`/events/${eventId}`);
};
