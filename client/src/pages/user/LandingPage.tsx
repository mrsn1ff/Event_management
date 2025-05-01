import { useEffect, useState } from 'react';
import { api } from '../../api/axios';
import EventCard from '../../components/EventCard';
import { Loader2, Calendar, Clock, MapPin } from 'lucide-react';

export interface EventType {
  _id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  image?: string;
}

const LandingPage = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/events');
        setEvents(res.data);
      } catch (error) {
        console.error('Failed to fetch events', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
        <p className="text-lg text-gray-600">Loading exciting events...</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white p-6 text-center">
        <Calendar className="h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          No Events Available
        </h2>
        <p className="text-lg text-gray-600 max-w-md">
          There are currently no events scheduled. Please check back later!
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Upcoming <span className="text-blue-600">Events</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover and register for our exciting upcoming events. Don't miss
            out on these amazing opportunities!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
