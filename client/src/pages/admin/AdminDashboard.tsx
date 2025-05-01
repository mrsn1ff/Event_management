import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AddEventPage from "./AddEventPage";
import EntryPage from "./EntryPage";
import RegistrationStatusPage from "./RegistrationStatusPage";
import { Menu, X, LogOut, PlusCircle, Ticket, BarChart2 } from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<"addEvent" | "entry" | "status">("addEvent");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleTabChange = (tab: "addEvent" | "entry" | "status") => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col w-64 bg-gradient-to-b from-blue-700 to-blue-800 text-white p-6">
        <div className="flex items-center space-x-3 mb-10">
          <Ticket className="h-8 w-8" />
          <h1 className="text-2xl font-bold">EventHub Admin</h1>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => handleTabChange("addEvent")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === "addEvent"
                ? "bg-white text-blue-800 shadow-md"
                : "text-white hover:bg-blue-600"
            }`}
          >
            <PlusCircle className="h-5 w-5" />
            <span>Add Event</span>
          </button>

          <button
            onClick={() => handleTabChange("entry")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === "entry"
                ? "bg-white text-blue-800 shadow-md"
                : "text-white hover:bg-blue-600"
            }`}
          >
            <Ticket className="h-5 w-5" />
            <span>Entry Page</span>
          </button>

          <button
            onClick={() => handleTabChange("status")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === "status"
                ? "bg-white text-blue-800 shadow-md"
                : "text-white hover:bg-blue-600"
            }`}
          >
            <BarChart2 className="h-5 w-5" />
            <span>Registration Status</span>
          </button>
        </div>

        <div className="mt-auto pt-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-white bg-red-500 hover:bg-red-600 transition-all"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Mobile Header */}
      <div className="md:hidden bg-gradient-to-r from-blue-700 to-blue-800 text-white p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-2">
          <Ticket className="h-6 w-6" />
          <h1 className="text-xl font-bold">EventHub Admin</h1>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1 rounded-md hover:bg-blue-600 transition-colors"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <button
            onClick={() => handleTabChange("addEvent")}
            className={`w-full flex items-center space-x-3 px-4 py-3 border-b border-gray-100 ${
              activeTab === "addEvent" ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"
            }`}
          >
            <PlusCircle className="h-5 w-5" />
            <span>Add Event</span>
          </button>
          <button
            onClick={() => handleTabChange("entry")}
            className={`w-full flex items-center space-x-3 px-4 py-3 border-b border-gray-100 ${
              activeTab === "entry" ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"
            }`}
          >
            <Ticket className="h-5 w-5" />
            <span>Entry Page</span>
          </button>
          <button
            onClick={() => handleTabChange("status")}
            className={`w-full flex items-center space-x-3 px-4 py-3 border-b border-gray-100 ${
              activeTab === "status" ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"
            }`}
          >
            <BarChart2 className="h-5 w-5" />
            <span>Registration Status</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        <div className="bg-white rounded-xl shadow-sm p-6 min-h-[calc(100vh-32px)] md:min-h-[calc(100vh-64px)]">
          {activeTab === "addEvent" && <AddEventPage />}
          {activeTab === "entry" && <EntryPage />}
          {activeTab === "status" && <RegistrationStatusPage />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;