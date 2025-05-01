import { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { api } from '../../api/axios';
import { toast } from 'react-toastify';
import { Ticket, Scan, CheckCircle2, XCircle, UserCheck } from 'lucide-react';

const EntryPage = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [result, setResult] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [status, setStatus] = useState<
    'idle' | 'valid' | 'duplicate' | 'invalid'
  >('idle');

  const handleScan = async (scanned: string) => {
    if (!scanned || scanned === result || isScanning) return;

    setIsScanning(true);
    setResult(scanned);
    setStatus('idle');

    try {
      const res = await api.post('/registrations/validate', { uuid: scanned });
      setUserData(res.data.data);
      setStatus('valid');
      toast.success('✅ Valid QR Code');
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Invalid or duplicate QR';
      setUserData(null);

      if (message.includes('already checked in')) {
        setStatus('duplicate');
        toast.error(`❌ ${message}`);
      } else {
        setStatus('invalid');
        toast.error(`❌ ${message}`);
      }
    } finally {
      setShowScanner(false);
      setIsScanning(false);
    }
  };

  const handleError = (err: any) => {
    console.error('QR Scan Error:', err);
    toast.error('Camera access denied or unavailable.');
  };

  const handleToggleScanner = () => {
    setShowScanner((prev) => !prev);
    setResult('');
    setUserData(null);
    setStatus('idle');
    setIsScanning(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Ticket className="h-6 w-6 mr-2 text-blue-600" />
            Event Entry Management
          </h2>
          <p className="text-gray-500 text-sm">
            {showScanner
              ? 'Scanning attendee QR codes'
              : 'Ready to scan attendee entries'}
          </p>
        </div>
      </div>

      {/* Scanner Controls */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col items-center">
          <button
            onClick={handleToggleScanner}
            className={`px-6 py-3 rounded-lg text-white font-medium flex items-center transition-all ${
              showScanner
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <Scan className="h-5 w-5 mr-2" />
            {showScanner ? 'Stop Scanning' : 'Start Scanning'}
          </button>

          {showScanner && (
            <p className="mt-4 text-gray-500 text-sm">
              Point the camera at the attendee's QR code
            </p>
          )}
        </div>
      </div>

      {/* Scanner and Results Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Scanner */}
        {showScanner && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Scanner
            </h3>
            <div className="relative w-full aspect-square border-2 border-blue-200 rounded-lg overflow-hidden">
              <QrReader
                constraints={{ facingMode: 'environment' }}
                scanDelay={300}
                onResult={(result, error) => {
                  if (result?.getText() && !isScanning) {
                    handleScan(result.getText());
                  }
                  if (error?.name === 'NotAllowedError') handleError(error);
                }}
                videoStyle={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                containerStyle={{ width: '100%', height: '100%' }}
              />
              <div className="absolute inset-0 border-4 border-dashed border-blue-300 rounded-lg pointer-events-none opacity-50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-4 border-blue-400 rounded-lg animate-pulse opacity-30"></div>
              </div>
            </div>
          </div>
        )}

        {/* Results Panel */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden min-h-[400px]">
          {/* Status Header */}
          <div
            className={`p-4 text-white ${
              status === 'valid'
                ? 'bg-green-600'
                : status === 'duplicate'
                ? 'bg-yellow-600'
                : status === 'invalid'
                ? 'bg-red-600'
                : 'bg-blue-600'
            }`}
          >
            <h3 className="text-xl font-bold flex items-center justify-center gap-2">
              {status === 'valid' && (
                <>
                  <CheckCircle2 className="h-6 w-6" />
                  VALID ENTRY
                </>
              )}
              {status === 'duplicate' && (
                <>
                  <XCircle className="h-6 w-6" />
                  ALREADY SCANNED
                </>
              )}
              {status === 'invalid' && (
                <>
                  <XCircle className="h-6 w-6" />
                  INVALID QR CODE
                </>
              )}
              {status === 'idle' && (
                <>
                  <Scan className="h-6 w-6" />
                  READY TO SCAN
                </>
              )}
            </h3>
          </div>

          {/* Status Content */}
          <div className="p-6">
            {status === 'valid' && userData && (
              <div className="space-y-6">
                <div className="flex flex-col items-center">
                  <div className="bg-green-100 text-green-800 rounded-full w-20 h-20 flex items-center justify-center text-3xl font-bold mb-4">
                    {userData.name.charAt(0)}
                  </div>
                  <h4 className="text-2xl font-bold text-gray-800 text-center">
                    {userData.name}
                  </h4>
                  <p className="text-gray-500 text-center">{userData.email}</p>
                </div>

                <div className="bg-green-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Event:</span>
                    <span className="text-gray-800">{userData.eventName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Venue:</span>
                    <span className="text-gray-800">{userData.eventVenue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Date:</span>
                    <span className="text-gray-800">
                      {new Date(userData.eventDate).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Phone:</span>
                    <span className="text-gray-800">{userData.phone}</span>
                  </div>
                </div>

                <div className="bg-green-100 border border-green-200 rounded-lg p-4 text-center">
                  <p className="text-green-800 font-medium">
                    Enjoy the event! 🎉
                  </p>
                </div>
              </div>
            )}

            {status === 'duplicate' && (
              <div className="flex flex-col items-center justify-center h-full py-10">
                <XCircle className="h-16 w-16 text-red-500 mb-4" />
                <h4 className="text-2xl font-bold text-red-600 mb-2">
                  ALREADY CHECKED IN
                </h4>
                <p className="text-gray-600 text-center max-w-md">
                  This QR code has already been scanned. Each ticket can only be
                  used once.
                </p>
              </div>
            )}

            {status === 'invalid' && (
              <div className="flex flex-col items-center justify-center h-full py-10">
                <XCircle className="h-16 w-16 text-red-500 mb-4" />
                <h4 className="text-2xl font-bold text-red-600 mb-2">
                  INVALID QR CODE
                </h4>
                <p className="text-gray-600 text-center max-w-md">
                  The scanned QR code is not valid for this event. Please check
                  and try again.
                </p>
              </div>
            )}

            {status === 'idle' && (
              <div className="flex flex-col items-center justify-center h-full py-10">
                <Scan className="h-16 w-16 text-blue-500 mb-4" />
                <h4 className="text-xl font-bold text-gray-700 mb-2">
                  Waiting for scan
                </h4>
                <p className="text-gray-500 text-center max-w-md">
                  Click "Start Scanning" and point the camera at an attendee's
                  QR code
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntryPage;
