import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Star, Users, Calendar, MapPin, Sparkles } from 'lucide-react';
// import { fetchEvents } from '../store/slices/eventsSlice';
import { setSearchQuery } from '../store/slices/uiSlice';
import EventCard from '../components/events/EventCard';
import CategoryGrid from '../components/events/CategoryGrid';

const LandingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories, events } = useSelector(state => state.events);
  const { searchQuery } = useSelector(state => state.ui);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const stats = [
    { icon: Calendar, label: 'Events Created', value: '10,000+' },
    { icon: Users, label: 'Happy Attendees', value: '500K+' },
    { icon: Star, label: 'Average Rating', value: '4.9' },
    { icon: MapPin, label: 'Cities Worldwide', value: '200+' },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Discover Amazing
                <span className="block bg-gradient-to-r from-accent-400 to-accent-500 bg-clip-text text-transparent">
                  Events Near You
                </span>
              </h1>
              <p className="text-xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
                From concerts to conferences, workshops to festivals - find and book tickets for the best events in your city.
              </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4 p-3 bg-white rounded-2xl shadow-2xl">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by event name, category, or location..."
                    value={searchQuery}
                    onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border-0 focus:ring-0 text-gray-700 placeholder-gray-500"
                  />
                </div>
                <button type="submit" className="btn-primary flex items-center space-x-2 whitespace-nowrap">
                  <span>Find Events</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </form>

            {/* Quick Categories */}
            <div className="flex flex-wrap justify-center gap-3">
              {['Music', 'Technology', 'Sports', 'Business', 'Arts'].map((category) => (
                <Link
                  key={category}
                  to={`/events?category=${category}`}
                  className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-all duration-200 border border-white/30"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center space-y-3 group">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="w-6 h-6 text-primary-600" />
            <h2 className="text-3xl font-bold text-gray-900">Featured Events</h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't miss out on these hand-picked amazing events happening soon
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.slice(0, 6).map((event, index) => (
            <EventCard key={event._id || index} event={event} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/events" className="btn-primary inline-flex items-center space-x-2">
            <span>View All Events</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find exactly what you're looking for with our comprehensive event categories
            </p>
          </div>
          <CategoryGrid categories={categories} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Create Your Own Event?
          </h2>
          <p className="text-xl text-primary-100 mb-8 leading-relaxed">
            Join thousands of organizers who trust EventHive to manage their events seamlessly
          </p>
          <Link
            to="/create-event"
            className="inline-flex items-center space-x-2 bg-white text-primary-600 font-semibold px-8 py-4 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <span>Start Creating</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
