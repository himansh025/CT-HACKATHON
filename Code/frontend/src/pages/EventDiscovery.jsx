import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Filter, MapPin, Grid, Map } from 'lucide-react';
import EventCard from '../components/events/EventCard';
import FilterSidebar from '../components/events/FilterSidebar';
import { setFilters } from '../store/slices/eventsSlice';

const EventDiscovery = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { events, filters } = useSelector(state => state.events);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('date');

  console.log("events", events);

  useEffect(() => {
    // Apply URL parameters to filters
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    if (category || search) {
      dispatch(setFilters({
        ...(category && { category }),
        ...(search && { search }),
      }));
    }
    
    // dispatch(fetchEvents(filters));
  }, [dispatch, searchParams]);

  // Get events list from either mock data or API response structure
  const getEventsList = () => {
    if (events && events.data && Array.isArray(events.data.events)) {
      return events.data.events;
    }
    if (Array.isArray(events)) {
      return events;
    }
    return [];
  };

  const eventsList = getEventsList();

  const filteredEvents = eventsList.filter(event => {
    if (!event) return false;

    // Category filter - exact same logic as before
    if (filters.category !== 'All' && event.category !== filters.category) return false;

    // Price filter - exact same logic as before
    const [minPrice, maxPrice] = filters.priceRange;
    if (event.price < minPrice || event.price > maxPrice) return false;

    // Search filter - exact same logic as before
    if (filters.search && !event.title.toLowerCase().includes(filters.search.toLowerCase())) return false;

    // Location filter - enhanced to handle both venue object and location string
    if (filters.location) {
      const locationText = event.venue?.address || event.venue?.name || event.location || '';
      if (!locationText.toLowerCase().includes(filters.location.toLowerCase())) return false;
    }

    return true;
  });

  // Sort events based on selected option
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(a.date) - new Date(b.date);
      case 'price':
        return a.price - b.price;
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'popular':
        return (b.attendees || 0) - (a.attendees || 0);
      default:
        return 0;
    }
  });

  const sortOptions = [
    { value: 'date', label: 'Date' },
    { value: 'price', label: 'Price' },
    { value: 'rating', label: 'Rating' },
    { value: 'popular', label: 'Most Popular' },
  ];

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  // Handle window resize to auto-close filters on mobile when switching to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setShowFilters(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Events</h1>
          <p className="text-gray-600">Find the perfect event for you</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex items-center space-x-4">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`lg:hidden flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors ${
                showFilters 
                  ? 'bg-primary-600 border-primary-600 text-white' 
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
              {filteredEvents.length > 0 && (
                <span className="bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {filteredEvents.length}
                </span>
              )}
            </button>
            
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-primary-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                aria-label="Grid view"
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'map' 
                    ? 'bg-primary-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                aria-label="Map view"
              >
                <Map className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="flex-1 flex justify-end">
            <select 
              value={sortBy}
              onChange={handleSortChange}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  Sort by {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? 'fixed inset-0 z-50 bg-black bg-opacity-50 lg:bg-transparent lg:relative' : 'hidden'} lg:block`}>
            <div className={`bg-white h-full lg:h-auto w-80 lg:w-full max-w-80 lg:max-w-none flex-shrink-0 transform transition-transform ${
              showFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            } lg:transform-none`}>
              <div className="p-6 lg:p-0 h-full overflow-y-auto lg:overflow-visible">
                <div className="flex items-center justify-between mb-6 lg:hidden">
                  <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Close filters"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <FilterSidebar />
                <div className="lg:hidden mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowFilters(false)}
                    className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                  >
                    Show {filteredEvents.length} Events
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {viewMode === 'grid' ? (
              <div className="space-y-6">
                {/* Results Count and Active Filters */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <p className="text-gray-600">
                    <span className="font-semibold text-gray-900">{sortedEvents.length}</span> events found
                  </p>
                  
                  {/* Active Filters Display */}
                  <div className="flex flex-wrap gap-2">
                    {filters.category !== 'All' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        Category: {filters.category}
                        <button 
                          onClick={() => dispatch(setFilters({ category: 'All' }))}
                          className="ml-1 hover:text-primary-900"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {filters.search && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Search: {filters.search}
                        <button 
                          onClick={() => dispatch(setFilters({ search: '' }))}
                          className="ml-1 hover:text-blue-900"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {filters.location && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Location: {filters.location}
                        <button 
                          onClick={() => dispatch(setFilters({ location: '' }))}
                          className="ml-1 hover:text-green-900"
                        >
                          ×
                        </button>
                      </span>
                    )}
                  </div>
                </div>

                {/* Events Grid */}
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="animate-pulse bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-gray-200 h-48"></div>
                        <div className="p-6 space-y-3">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                          <div className="flex justify-between items-center pt-4">
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : sortedEvents.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Found</h3>
                    <p className="text-gray-600 mb-6">Try adjusting your filters or search terms to find more events.</p>
                    <button
                      onClick={() => {
                        dispatch(setFilters({
                          category: 'All',
                          search: '',
                          location: '',
                          priceRange: [0, 1000]
                        }));
                        setShowFilters(true);
                      }}
                      className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {sortedEvents.map((event) => (
                        <EventCard key={event._id} event={event} />
                      ))}
                    </div>
                    
                    {/* Load More Button (for future pagination) */}
                    {events?.data?.pagination?.hasNext && (
                      <div className="flex justify-center mt-8">
                        <button
                          className="bg-white text-primary-600 border border-primary-600 px-6 py-2 rounded-lg hover:bg-primary-50 transition-colors"
                          onClick={() => {
                            // Add pagination logic here
                            console.log('Load more events');
                          }}
                        >
                          Load More Events
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Map View Coming Soon</h3>
                <p className="text-gray-600 mb-4">We're working on an interactive map to show events near you.</p>
                <p className="text-sm text-gray-500">In the meantime, use the grid view to browse all available events.</p>
                <button
                  onClick={() => setViewMode('grid')}
                  className="mt-4 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Switch to Grid View
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDiscovery;