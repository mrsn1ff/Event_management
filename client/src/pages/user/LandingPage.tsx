import { useEffect, useState } from 'react';
import EventCard from '../../components/EventCard';
import { EventType } from '../../types/event'; // Updated import
import { api } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const LandingPage = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleDeleteSuccess = (deletedEventId: string) => {
    setEvents(events.filter((event) => event._id !== deletedEventId));
  };

  if (loading) {
    return <div>Loading events...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Upcoming Events</h1>

      {events.length === 0 ? (
        <p className="text-center text-gray-500">No events scheduled yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              isAdmin={isAdmin}
              onDeleteSuccess={handleDeleteSuccess}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LandingPage;
