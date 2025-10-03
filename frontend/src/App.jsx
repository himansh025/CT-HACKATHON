import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingPage from './pages/LandingPage';
import EventDiscovery from './pages/EventDiscovery';
import EventDetail from './pages/EventDetail';
import CreateEvent from './components/CreateEvent/CreateEvent';
import Checkout from './pages/Checkout';
import UserDashboard from './pages/UserDashboard';
import OrganizerDashboard from './pages/OrganizerDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import Loader from './components/Loader';
import { setEvents } from './store/slices/eventsSlice';
import axiosInstance from './config/apiconfig';
import NotificationPopup from './components/NotificationPopup'; // Import new component
import Chatbot from './components/Chatbot';


function App() {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false);
  const { events } = useSelector(state => state.events);
  console.log("events", events);
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get("/events");
        console.log("Backend response:", data.data);
        dispatch(setEvents(data.data.events));
      }
      catch (err) {
        console.error("Error get event:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchEvent()
  }, []);


  if (loading) {
    return (
      <Loader />
    )
  }
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-inter">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/events" element={<EventDiscovery />} />
            <Route path="/event/:id" element={<EventDetail />} />

            
            {user?.role === "organizer" && (
              <>
                <Route path="/create-event" element={<CreateEvent />} />
                <Route path="/organizer-dashboard" element={<OrganizerDashboard />} />
              </>
            )
            }
            {user?.role === "user" && (
              <>

                <Route path="/checkout/:eventId" element={<Checkout />} />
                <Route path="/dashboard" element={<UserDashboard />} />
              </>
            )}
          </Routes>
        </main>
        {user && <Chatbot />}
        <Footer />
                {user && <NotificationPopup />} {/* Render the notification pop-up if user is logged in */}

      </div>
    </Router>
  );
}

export default App;
