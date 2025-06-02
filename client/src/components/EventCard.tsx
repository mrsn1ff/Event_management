import { Link, useNavigate } from 'react-router-dom';
import { EventType } from '../types/event'; // Updated import
import {
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  Edit,
  Trash2,
} from 'lucide-react';
import { api } from '../api/axios';
import { toast } from 'react-toastify';

interface EventCardProps {
  event: EventType;
  isAdmin: boolean;
  onDeleteSuccess?: (deletedEventId: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  isAdmin,
  onDeleteSuccess,
}) => {
  const imageBaseUrl =
    process.env.REACT_APP_IMAGE_API_URL || 'http://localhost:5000';
  const imageUrl = event.image ? `${imageBaseUrl}${event.image}` : null;
  const navigate = useNavigate();

  const eventDate = new Date(`${event.date}T${event.time}`);
  const eventDateString = eventDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const eventTimeString = eventDate.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this event?',
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/events/${id}`);
      toast.success('Event deleted successfully');
      if (onDeleteSuccess) {
        onDeleteSuccess(id);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete the event');
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/events/edit/${id}`);
  };

  return (
    <div className="group relative bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-gray-100">
      {isAdmin && (
        <div className="absolute top-4 right-4 z-10 flex space-x-2">
          <button
            onClick={() => handleEdit(event._id)}
            className="p-2 bg-white rounded-full shadow-md hover:bg-blue-50 text-blue-600 transition-colors"
            title="Edit Event"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(event._id)}
            className="p-2 bg-white rounded-full shadow-md hover:bg-red-50 text-red-600 transition-colors"
            title="Delete Event"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Rest of your EventCard JSX remains the same */}
      <div className="relative h-56 w-full overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={event.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
            <div className="text-center p-4">
              <Calendar className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 font-medium">{event.name}</p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {event.name}
        </h3>

        <div className="space-y-3 mb-5">
          <div className="flex items-start space-x-3">
            <Calendar className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{eventDateString}</span>
          </div>
          <div className="flex items-start space-x-3">
            <Clock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{eventTimeString}</span>
          </div>
          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{event.venue}</span>
          </div>
        </div>

        <Link
          to={`/register/${event._id}`}
          className="inline-flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-300 group-hover:shadow-md"
        >
          Register Now
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
