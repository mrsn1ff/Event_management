export type EventType = {
  _id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  image?: string;
  registrations?: Array<{
    name: string;
    email: string;
    phone: string;
    qrCode: string;
    uuid: string;
    checkedIn: boolean;
    registeredAt: string;
    checkedInAt?: string;
  }>;
};
