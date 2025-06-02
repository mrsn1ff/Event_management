import { api } from '../api/axios';

export const updateEvent = async (eventId: string, updatedData: FormData) => {
  return await api.put(`/events/${eventId}`, updatedData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
