import React, { useEffect, useState } from 'react';
import { 
  BarChart3, Calendar, Users, DollarSign, Plus, TrendingUp,
  Eye, Edit, Settings, Download, Trash2, IndianRupee // <-- FIXED: Added IndianRupee
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axiosInstance from '../config/apiconfig';
import Loader from '../components/Loader';
import EditProfile from '../components/EditProfile';

const OrganizerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({});
  const [recentBookings, setRecentBookings] = useState([]);
  const [allOrganizerEvents, setAllOrganizerEvents] = useState([]);
  const [eventStatusFilter, setEventStatusFilter] = useState('All'); 

  // Function to fetch dashboard stats (for overview tab)
  const fetchDashboardStats = async () => {
    try {
      const { data } = await axiosInstance.get("/organizer/dashboard");
      setStats(data.data.stats);
      setRecentBookings(data.data.recentBookings); 
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
    }
  };

  // Function to fetch the comprehensive list of ALL events (for events tab)
  const fetchAllEvents = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/organizer/events");
      setAllOrganizerEvents(data?.data?.events || []); 
    } catch (err) {
      console.error("Error fetching all organizer events:", err);
      setAllOrganizerEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
    fetchAllEvents();
  }, []);
  
  // Helper component to render currency consistently
  const CurrencyDisplay = ({ amount, className = '', prependSymbol = false }) => (
    <div className={`flex items-center ${className}`}>
      <IndianRupee className="w-4 h-4 mr-0.5" />
      <span>{amount}</span>
    </div>
  );

  // --- IMPLEMENTED FUNCTIONALITY: CSV Conversion and Export ---
  const convertToCSV = (data, filename) => {
    if (data.length === 0) {
      alert("No data available to export.");
      return;
    }
    
    const headers = Object.keys(data[0]);
    const csvRows = [];
    
    // 1. Add headers
    csvRows.push(headers.join(','));

    // 2. Add data rows, escaping inner quotes
    for (const row of data) {
      const values = headers.map(header => {
        // Replace double quotes with two double quotes and wrap in double quotes
        const escaped = ('' + row[header]).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

    // Create download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };
  
  const handleExportData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/organizer/export-data");
      const exportData = response.data.data;
      
      const filename = `event_bookings_${new Date().toISOString().slice(0, 10)}.csv`;
      
      convertToCSV(exportData, filename);
      alert("Booking data export initiated successfully.");

    } catch (error) {
      console.error("Error exporting data:", error);
      alert("Failed to export data. Check server connection.");
    } finally {
      setLoading(false);
    }
  };
  // --- END EXPORT FUNCTIONALITY ---


  // --- IMPLEMENTED FUNCTIONALITY: HANDLE EVENT DELETION ---
  const handleDeleteEvent = async (eventId, eventTitle) => {
      if (window.confirm(`Are you sure you want to delete the event: "${eventTitle}"? This cannot be undone.`)) {
          try {
              await axiosInstance.delete(`/events/${eventId}`);
              
              // Optimistically update the list by filtering the deleted event
              setAllOrganizerEvents(prevEvents => prevEvents.filter(event => event._id !== eventId));
              
              alert(`Event "${eventTitle}" deleted successfully.`);
              fetchDashboardStats(); // Refresh overall stats/counts
          } catch (error) {
              console.error("Error deleting event:", error);
              alert("Failed to delete event. Check server logs.");
          }
      }
  };
  // --- END DELETE FUNCTION ---

  // FILTERED EVENTS logic now uses the comprehensive list
  const displayedEvents = allOrganizerEvents.filter(event => {
    if (eventStatusFilter === 'All') return true;
    return event.status === eventStatusFilter;
  });


  const statCards = [
    { label: 'Total Events', value: stats.totalEvents || 0, icon: Calendar, color: 'primary' },
    { label: 'Total Revenue', value: `₹${stats.totalRevenue || 0}`, icon: DollarSign, color: 'green' },
    { label: 'Tickets Sold', value: stats.ticketsSold || 0, icon: Users, color: 'blue' },
    { label: 'Avg. Rating', value: stats.avgRating || 0, icon: TrendingUp, color: 'accent' },
  ];

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Organizer Dashboard</h1>
            <p className="text-gray-600">Manage your events and track performance</p>
          </div>
          <Link to="/create-event" className="btn-primary inline-flex items-center space-x-2 mt-4 lg:mt-0">
            <Plus className="w-5 h-5" />
            <span>Create New Event</span>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                  stat.color === 'primary' ? 'bg-primary-100 text-primary-600' :
                  stat.color === 'green' ? 'bg-green-100 text-green-600' :
                  stat.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                  'bg-accent-100 text-accent-600'
              }`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {/* Renders Rupee symbol only for Total Revenue stat card */}
                {stat.label === 'Total Revenue' ? (
                  <CurrencyDisplay amount={stats.totalRevenue} className="text-2xl font-bold text-gray-900" />
                ) : (
                  stat.value
                )}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {['overview', 'events', 'analytics', 'settings'].map((tab) => (
               <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 flex border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                    {tab==="settings" &&(
                            <Settings className="w-10 h-5 text-primary-600" />
               )}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <Link to="/create-event" className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Plus className="w-8 h-8 text-primary-600" />
                    <div>
                      <div className="font-medium text-gray-900">Create Event</div>
                      <div className="text-sm text-gray-600">Start planning your next event</div>
                    </div>
                  </Link>
                  <button onClick={() => setActiveTab('analytics')} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <BarChart3 className="w-8 h-8 text-green-600" />
                    <div>
                      <div className="font-medium text-gray-900">View Analytics</div>
                      <div className="text-sm text-gray-600">Check your performance</div>
                    </div>
                  </button>
                  
                  {/* --- WIRED EXPORT DATA BUTTON --- */}
                  <button onClick={handleExportData} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors" disabled={loading}>
                    <Download className="w-8 h-8 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-900">Export Data</div>
                      <div className="text-sm text-gray-600">Download booking reports</div>
                    </div>
                  </button>
                </div>
                
                {/* Placeholder for Recent Bookings/Activity Feed */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings (Last 5)</h3>
                    {recentBookings.length > 0 ? (
                        <ul className="space-y-3">
                           {recentBookings.slice(0, 5).map((booking, i) => (
                             <li key={i} className="text-gray-700 text-sm flex justify-between items-center">
                               <span>Booking ID: {booking.bookingId} for {booking.eventTitle || 'Event'}</span>
                               <span className='font-medium'>Tickets: {booking.quantity}</span>
                             </li>
                           ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No recent bookings found.</p>
                    )}
                </div>
              </div>
            )}

            {activeTab === 'events' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">All My Events ({allOrganizerEvents.length})</h3>
                    {/* Event Status Filter */}
                    <select
                        value={eventStatusFilter}
                        onChange={(e) => setEventStatusFilter(e.target.value)}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Published">Published</option>
                        <option value="Draft">Draft</option>
                    </select>
                </div>

                {displayedEvents.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Found</h3>
                        <p className="text-gray-600">Try changing the filter or create a new event.</p>
                    </div>
                ) : (
                    displayedEvents.map((event) => (
                      <div key={event._id} className="border border-gray-200 rounded-xl p-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                          <img
                            src={event?.images?.[0] || ''}
                            alt={event.title}
                            className="w-full lg:w-48 h-32 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h4 className="text-xl font-semibold text-gray-900">{event.title}</h4>
                                <p className="text-gray-600">{event.date?.slice(0,10)}</p>
                                <p className="text-gray-600">{event.time}</p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  event.status === 'Published' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {event.status}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                              <div>
                                <div className="text-sm text-gray-500">Tickets Sold</div>
                                <div className="font-semibold text-gray-900">
                                  {event.ticketsSold}/{event.totalTickets}
                                </div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-500">Revenue</div>
                                <CurrencyDisplay amount={event.revenue} className="font-semibold text-gray-900" />
                              </div>
                              <div>
                                <div className="text-sm text-gray-500">Completion</div>
                                <div className="font-semibold text-gray-900">
                                  {event.totalTickets > 0 
                                    ? Math.round((event.ticketsSold / event.totalTickets) * 100)
                                    : 0}%
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {/* View Button */}
                              <Link to={`/event/${event._id}`} className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                                <Eye className="w-4 h-4" />
                                <span>View</span>
                              </Link>
                              
                              {/* Edit Button (Wired for Edit flow) */}
                              <Link to={`/create-event?edit=${event._id}`} className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                                <Edit className="w-4 h-4" />
                                <span>Edit</span>
                              </Link>

                              {/* Analytics Button */}
                              <button onClick={() => setActiveTab('analytics')} className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                                <BarChart3 className="w-4 h-4" />
                                <span>Analytics</span>
                              </button>
                              
                              {/* Delete Button (Wired for deletion) */}
                              <button 
                                onClick={() => handleDeleteEvent(event._id, event.title)}
                                className="flex items-center space-x-1 px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Overall Event Analytics</h3>
                
                {/* Chart Placeholder */}
                <div className="bg-gray-100 h-64 rounded-xl flex items-center justify-center border border-gray-200">
                    <p className="text-gray-500">Sales vs. Attendees Chart Placeholder</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-3">Revenue Breakdown</h4>
                        <ul className="space-y-2 text-sm">
                            <li className="flex justify-between"><span>Total Tickets Sold:</span> <span className="font-medium">{stats.ticketsSold}</span></li>
                            <li className="flex justify-between">
                              <span>Gross Revenue:</span> 
                              <CurrencyDisplay amount={stats.totalRevenue} className="font-medium" />
                            </li>
                            {/* Platform Fees Calculation */}
                            <li className="flex justify-between">
                              <span>Platform Fees (5%):</span> 
                              <CurrencyDisplay amount={((stats.totalRevenue || 0) * 0.05).toFixed(2)} className="font-medium text-red-500" prependSymbol={true} />
                            </li>
                            <li className="flex justify-between pt-2 border-t font-bold">
                              <span>Net Revenue:</span> 
                              <CurrencyDisplay amount={((stats.totalRevenue || 0) * 0.95).toFixed(2)} />
                            </li>
                        </ul>
                    </div>
                    
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-3">Top Performing Events</h4>
                        <ul className="space-y-2 text-sm">
                            {/* Sorts events by revenue for display */}
                            {allOrganizerEvents.sort((a,b) => b.revenue - a.revenue).slice(0, 3).map((event, i) => (
                                <li key={i} className="flex justify-between text-gray-700">
                                    <span>{event.title}</span>
                                    <CurrencyDisplay amount={event.revenue} className="font-medium text-green-600" />
                                </li>
                            ))}
                            {allOrganizerEvents.length === 0 && <li className="text-gray-500">No event data to display.</li>}
                        </ul>
                    </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' &&
            <>
            <EditProfile/>  
            </>
}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
