import { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { toast } from 'react-toastify';
import { api } from '../../api/axios';

const QrScanner = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState('');
  const [userData, setUserData] = useState<any>(null);

  const handleScan = async (scanned: string) => {
    if (!scanned || scanned === result || isScanning) return;

    setIsScanning(true);
    setResult(scanned);

    try {
      const res = await api.post('/registrations/validate', { uuid: scanned });
      setUserData(res.data.data);
      toast.success('✅ Valid QR Code');
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Invalid or duplicate QR';
      setUserData(null);
      toast.error(`❌ ${message}`);
    } finally {
      setShowScanner(false); // Hide scanner to stop scanning
      setIsScanning(false); // Allow scanning again on restart
    }
  };

  const handleError = (err: any) => {
    console.error('QR Scan Error:', err);
    toast.error('Camera access denied or not available.');
  };

  const handleToggleScanner = () => {
    setShowScanner((prev) => !prev);
    setIsScanning(false);
    setResult('');
    setUserData(null);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6">QR Code Scanner</h2>

      <button
        onClick={handleToggleScanner}
        className="mb-6 px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
      >
        {showScanner ? 'Stop Scanning' : 'Start Scanning'}
      </button>

      <div className="flex flex-col lg:flex-row items-center gap-8 w-full max-w-5xl">
        {showScanner && (
          <div className="relative w-[90vw] max-w-sm aspect-square border-4 border-indigo-500 rounded-xl overflow-hidden shadow-lg">
            <QrReader
              constraints={{ facingMode: 'environment' }}
              scanDelay={300}
              onResult={(result, error) => {
                if (result?.getText() && !isScanning) {
                  handleScan(result.getText());
                }
                if (error?.name === 'NotAllowedError') handleError(error);
              }}
              videoStyle={{ width: '100%', height: '100%', objectFit: 'cover' }}
              containerStyle={{ width: '100%', height: '100%' }}
            />
            <div className="absolute inset-0 border-4 border-dashed border-green-400 rounded-xl pointer-events-none" />
          </div>
        )}

        {userData && (
          <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-green-600 mb-4">
              ✅ Valid QR Code
            </h3>
            <p className="mb-2">
              <span className="font-medium">Name:</span> {userData.name}
            </p>
            <p className="mb-2">
              <span className="font-medium">Email:</span> {userData.email}
            </p>
            <p className="mb-2">
              <span className="font-medium">Phone:</span> {userData.phone}
            </p>
            <p className="mb-2">
              <span className="font-medium">Event:</span> {userData.eventName}
            </p>
            <p className="mb-2">
              <span className="font-medium">Venue:</span> {userData.eventVenue}
            </p>
            <p>
              <span className="font-medium">Date:</span>{' '}
              {new Date(userData.eventDate).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QrScanner;
