import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters } from '../../store/slices/eventsSlice';
import { Calendar, DollarSign, MapPin, Tag } from 'lucide-react';

const FilterSidebar = () => {
  const dispatch = useDispatch();
  const { filters, categories } = useSelector(state => state.events);
console.log(filters,categories);
  const handleFilterChange = (filterType, value) => {
    console.log("aay",filterType,value);
    dispatch(setFilters({ [filterType]: value }));
  };

  const priceRanges = [
    { label: 'Free', min: 0, max: 0 },
    { label: 'Under $50', min: 0, max: 50 },
    { label: '$50 - $100', min: 50, max: 100 },
    { label: '$100 - $250', min: 100, max: 250 },
    { label: '$250+', min: 250, max: 1000 },
  ];

  return (
    <div className="bg-white rounded-xl p-6 space-y-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900">Filters</h3>

      {/* Category Filter */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Tag className="w-5 h-5 text-primary-600" />
          <h4 className="font-medium text-gray-900">Category</h4>
        </div>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="category"
                value={category}
                checked={filters.category === category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-4 h-4 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-gray-700">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <DollarSign className="w-5 h-5 text-primary-600" />
          <h4 className="font-medium text-gray-900">Price Range</h4>
        </div>
        <div className="space-y-2">
          {priceRanges.map((range, index) => (
            <label key={index} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="priceRange"
                checked={filters.priceRange[0] === range.min && filters.priceRange[1] === range.max}
                onChange={() => handleFilterChange('priceRange', [range.min, range.max])}
                className="w-4 h-4 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-gray-700">{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Date Filter */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-primary-600" />
          <h4 className="font-medium text-gray-900">Date</h4>
        </div>
        <input
          type="date"
          value={filters.date || ''}
          onChange={(e) => handleFilterChange('date', e.target.value)}
          className="input-field"
        />
      </div>

      {/* Location Filter */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-primary-600" />
          <h4 className="font-medium text-gray-900">Location</h4>
        </div>
        <input
          type="text"
          placeholder="Enter city or venue"
          value={filters.location}
          onChange={(e) => handleFilterChange('location', e.target.value)}
          className="input-field"
        />
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => dispatch(setFilters({
          category: 'All',
          priceRange: [0, 1000],
          date: null,
          location: '',
          search: ''
        }))}
        className="w-full py-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
};

export default FilterSidebar;