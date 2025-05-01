import { useState } from 'react';
import { api } from '../../api/axios';
import { toast } from 'react-toastify';
import { CloudUpload, Calendar, MapPin, Ticket, Clock } from 'lucide-react';

const AddEventPage = () => {
  const [form, setForm] = useState({
    name: '',
    date: '',
    time: '',
    venue: '',
    image: null as File | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'image') {
      setForm({ ...form, image: e.target.files?.[0] || null });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    data.append('name', form.name);
    data.append('date', form.date);
    data.append('time', form.time);
    data.append('venue', form.venue);
    if (form.image) data.append('image', form.image);

    try {
      await api.post('/events', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Event added successfully!');
      setForm({ name: '', date: '', time: '', venue: '', image: null });
    } catch (err) {
      toast.error('Error creating event');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
          <div className="flex items-center space-x-3">
            <Ticket className="h-8 w-8" />
            <h2 className="text-2xl font-bold">Create New Event</h2>
          </div>
          <p className="mt-1 opacity-90">
            Fill in the details below to add a new event
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <Ticket className="h-4 w-4 mr-2 text-blue-600" />
              Event Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter event name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-blue-600" />
              Date
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <Clock className="h-4 w-4 mr-2 text-blue-600" />
              Time
            </label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-blue-600" />
              Venue
            </label>
            <input
              type="text"
              name="venue"
              placeholder="Enter venue"
              value={form.venue}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <CloudUpload className="h-4 w-4 mr-2 text-blue-600" />
              Event Image
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col w-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                  <CloudUpload className="h-10 w-10 text-gray-400 mb-3" />
                  <p className="text-sm text-gray-500 text-center">
                    {form.image ? (
                      <span className="text-blue-600 font-medium">
                        {form.image.name}
                      </span>
                    ) : (
                      <>
                        <span className="font-semibold">Click to upload</span>{' '}
                        or drag and drop
                        <br />
                        <span className="text-xs">
                          PNG, JPG, JPEG (Max. 5MB)
                        </span>
                      </>
                    )}
                  </p>
                </div>
                <input
                  type="file"
                  name="image"
                  onChange={handleChange}
                  className="hidden"
                  accept="image/*"
                />
              </label>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating Event...
                </>
              ) : (
                'Create Event'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventPage;
