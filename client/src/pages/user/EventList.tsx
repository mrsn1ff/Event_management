import { useEffect, useState } from 'react';
import axios from 'axios';
import { Event } from '../../types/index';
import { Link } from 'react-router-dom';

const EventList = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

    axios
      .get(`${apiUrl}/events`)
      .then((res) => setEvents(res.data))
      .catch((err) => console.error('Failed to fetch events', err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Available Events</h2>
      <ul className="space-y-4">
        {events.map((event) => (
          <li key={event._id} className="border p-4 rounded shadow">
            <h3 className="text-xl font-semibold">{event.name}</h3>
            <p>
              Date: {new Date(`${event.date}T${event.time}`).toLocaleString()}
            </p>
            <p>Venue: {event.venue}</p>
            <Link
              to={`/register/${event._id}`}
              className="inline-block mt-2 text-blue-600 hover:underline"
            >
              Register
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;
