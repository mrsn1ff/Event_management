import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface Registration {
  name: string;
  email: string;
  phone: string;
  uuid: string;
  qrCode: string;
  checkedIn: boolean;
  registeredAt: string;
  checkedInAt: string | null;
}

function EventRegistrationPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [eventName, setEventName] = useState("");

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/event/${eventId}`);
        setRegistrations(response.data.registrations);
        setEventName(response.data.eventName);
      } catch (error) {
        console.error("Failed to fetch registrations", error);
      }
    };

    if (eventId) {
      fetchRegistrations();
    }
  }, [eventId]);

  return (
    <div>
      <h1>Registrations for {eventName}</h1>
      <ul>
        {registrations.map((reg) => (
          <li key={reg.uuid}>
            {reg.name} - {reg.email} - {reg.phone}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EventRegistrationPage;
