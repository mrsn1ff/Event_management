import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import handleDownloadPdf from '../../utils/handleDownloadPdf';
import {
  CheckCircle2,
  Download,
  Printer,
  User,
  Mail,
  Phone,
  Loader2,
  ArrowRight,
  Ticket,
} from 'lucide-react';

const RegisterForm = () => {
  const { id } = useParams();
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [qrCode, setQrCode] = useState('');
  const [registrationId, setRegistrationId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await axios.post(
        'http://localhost:5000/api/registrations/register',
        {
          ...form,
          eventId: id,
        },
      );
      setQrCode(res.data.data.qrCode);
      setRegistrationId(res.data.data._id);
      setShowConfetti(true);
    } catch (err) {
      alert('Registration failed!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8 relative">
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.2}
        />
      )}

      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden md:max-w-2xl transition-all duration-300 hover:shadow-2xl">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white text-center">
          <h2 className="text-3xl font-bold flex items-center justify-center gap-2">
            <Ticket className="h-8 w-8" />
            Event Registration
          </h2>
          <p className="mt-2 opacity-90">
            {qrCode
              ? 'Your registration is complete!'
              : 'Fill in your details to get your Hall Ticket'}
          </p>
        </div>

        <div className="p-8">
          {!qrCode ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-5">
                <div className="relative">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="relative">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="john@example.com"
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="relative">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="+91 9898456545"
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                      pattern="[0-9]{10}"
                      maxLength={10}
                      inputMode="numeric"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center items-center py-3 px-6 rounded-lg shadow-md text-white bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 ${
                  isSubmitting ? 'opacity-80' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    Register Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center animate-fade-in">
              <div className="mb-6">
                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto animate-bounce" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Registration Successful!
              </h3>
              <p className="text-gray-600 mb-8">
                Your QR code for event entry has been generated. Please save or
                print this ticket.
              </p>

              <div className="bg-white p-4 rounded-xl border-2 border-dashed border-blue-100 inline-block mb-8 transform hover:scale-105 transition-transform duration-300">
                <img src={qrCode} alt="QR Code" className="w-48 h-48 mx-auto" />
                <div className="mt-4 text-sm text-gray-500">
                  <p>{form.name}</p>
                  <p className="text-xs mt-1">Event ID: {id?.slice(-6)}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() =>
                    handleDownloadPdf(registrationId, qrCode, form)
                  }
                  className="flex items-center justify-center px-6 py-3 rounded-lg bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-md transition-all"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download Ticket
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center justify-center px-6 py-3 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-md transition-all"
                >
                  <Printer className="h-5 w-5 mr-2" />
                  Print Ticket
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
