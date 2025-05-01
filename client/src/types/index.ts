export interface Event {
  _id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
}

export interface RegistrationRequest {
  name: string;
  email: string;
  phone: string;
  eventId: string;
}
