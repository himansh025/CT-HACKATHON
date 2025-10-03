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
  
  const [isLoading,setLoading]=useState(false)
  console.log("events",events);

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


const filteredEvents = events.filter(event => {
  // Category filter
  if (filters.category !== 'All' && event.category !== filters.category) return false;

  // Price filter
  const [minPrice, maxPrice] = filters.priceRange;
  if (event.price < minPrice || event.price > maxPrice) return false;

  // Search filter
  if (filters.search && !event.title.toLowerCase().includes(filters.search.toLowerCase())) return false;

  // Location filter
  if (filters.location && !event.location.toLowerCase().includes(filters.location.toLowerCase())) return false;

  return true;
});


  const sortOptions = [
    { value: 'date', label: 'Date' },
    { value: 'price', label: 'Price' },
    { value: 'rating', label: 'Rating' },
    { value: 'popular', label: 'Most Popular' },
  ];

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
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
            
            <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-2 rounded ${viewMode === 'map' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Map className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 flex justify-end">
            <select className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
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
          <div className={`lg:block ${showFilters ? 'block' : 'hidden'} w-full lg:w-80 flex-shrink-0`}>
            <FilterSidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {viewMode === 'grid' ? (
              <div className="space-y-6">
                {/* Results Count */}
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">
                    {filteredEvents.length} events found
                  </p>
                </div>

                {/* Events Grid */}
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="bg-gray-200 h-48 rounded-t-xl"></div>
                        <div className="bg-white p-6 rounded-b-xl space-y-3">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredEvents?.map((event) => (
                      <EventCard key={event._id} event={event} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-8 text-center">
                <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Map View Coming Soon</h3>
                <p className="text-gray-600">We're working on an interactive map to show events near you.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDiscovery;