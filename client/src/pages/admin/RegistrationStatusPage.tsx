import { useEffect, useState } from 'react';
import { api } from '../../api/axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  Download,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Ticket,
} from 'lucide-react';

interface Event {
  _id: string;
  name: string;
}

interface Registration {
  _id: string;
  name: string;
  email: string;
  phone: string;
  eventName: string;
  checkedIn: boolean;
}

const RegistrationStatusPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [viewMode, setViewMode] = useState<'all' | 'checkedIn' | 'absent'>(
    'all',
  );

  const [loadingEvents, setLoadingEvents] = useState(false);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoadingEvents(true);
      setError(null);
      try {
        const response = await api.get('/events');
        setEvents(response.data);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to fetch events. Please try again later.');
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      const fetchRegistrations = async () => {
        setLoadingRegistrations(true);
        setError(null);
        try {
          const response = await api.get(
            `/registrations/event/${selectedEventId}`,
          );
          setRegistrations(response.data.registrations);
        } catch (err) {
          console.error('Error fetching registrations:', err);
          setError('Failed to fetch registrations. Please try again later.');
        } finally {
          setLoadingRegistrations(false);
        }
      };
      fetchRegistrations();
    }
  }, [selectedEventId]);

  const filteredRegistrations = registrations.filter((registration) => {
    if (viewMode === 'all') return true;
    if (viewMode === 'checkedIn') return registration.checkedIn;
    if (viewMode === 'absent') return !registration.checkedIn;
    return true;
  });

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Find the selected event name
    const selectedEvent = events.find((event) => event._id === selectedEventId);
    const eventName = selectedEvent ? selectedEvent.name : 'event';

    doc.text(
      `Registrations Report (${
        viewMode === 'all'
          ? 'Total'
          : viewMode === 'checkedIn'
          ? 'Checked In'
          : 'Absent'
      })`,
      14,
      15,
    );

    const tableData = filteredRegistrations.map((reg) => [
      reg.name,
      reg.email,
      reg.phone,
      reg.eventName,
      reg.checkedIn ? 'Yes' : 'No',
    ]);

    autoTable(doc, {
      head: [['Name', 'Email', 'Phone', 'Event', 'Checked In']],
      body: tableData,
      startY: 20,
    });

    // Generate filename: eventname-registration-viewmode.pdf
    const filename = `${eventName}_registration_${viewMode}.pdf`
      .replace(/\s+/g, '_') // replace spaces with hyphens
      .toLowerCase();

    doc.save(filename);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Registration Status
        </h2>
        {selectedEventId && !loadingRegistrations && (
          <button
            onClick={handleDownloadPDF}
            className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors mt-4 md:mt-0"
          >
            <Download className="h-5 w-5" />
            <span>Download Report</span>
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="mb-6">
        <label
          htmlFor="event-select"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Select Event
        </label>
        <select
          id="event-select"
          value={selectedEventId || ''}
          onChange={(e) => setSelectedEventId(e.target.value)}
          className="w-full md:w-96 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          disabled={loadingEvents}
        >
          <option value="">
            {loadingEvents ? 'Loading events...' : 'Select an event'}
          </option>
          {events.map((event) => (
            <option key={event._id} value={event._id}>
              {event.name}
            </option>
          ))}
        </select>
      </div>

      {selectedEventId && !loadingRegistrations && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Filter Registrations
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setViewMode('all')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>All</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-md text-sm">
                {registrations.length}
              </span>
            </button>
            <button
              onClick={() => setViewMode('checkedIn')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'checkedIn'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Checked In</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-md text-sm">
                {registrations.filter((r) => r.checkedIn).length}
              </span>
            </button>
            <button
              onClick={() => setViewMode('absent')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'absent'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <XCircle className="h-4 w-4" />
              <span>Absent</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-md text-sm">
                {registrations.filter((r) => !r.checkedIn).length}
              </span>
            </button>
          </div>
        </div>
      )}

      {loadingRegistrations ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          <span className="ml-3 text-gray-600">Loading registrations...</span>
        </div>
      ) : filteredRegistrations.length === 0 && selectedEventId ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <div className="text-gray-400 mb-2">
            <Ticket className="h-10 w-10 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-1">
            No registrations found
          </h3>
          <p className="text-gray-500">
            There are no registrations for this event matching your filter.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Phone
                </th>

                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRegistrations.map((reg) => (
                <tr
                  key={reg._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {reg.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {reg.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {reg.phone}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        reg.checkedIn
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {reg.checkedIn ? 'Checked In' : 'Not Checked In'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RegistrationStatusPage;
