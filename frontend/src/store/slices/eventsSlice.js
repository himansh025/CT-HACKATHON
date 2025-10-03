// Event-App/frontend/src/store/slices/eventsSlice.js

import { createSlice } from '@reduxjs/toolkit';
import { mockEvents } from '../../data/mockEvent'; // Import mock data

const eventsSlice = createSlice({
  name: 'events',
  initialState: {
    events: mockEvents, // Use mockEvents as initial state
    featuredEvents: [],
    currentEvent: null,
    categories: ['All', 'Technology', 'Music', 'Business', 'Sports', 'Arts', 'Food', 'Health'],
    filters: {
      category: 'All',
      priceRange: [0, 1000],
      date: null,
      location: '',
      search: ''
    },
    isLoading: false,
    error: null,
  },
  reducers: {
// ... (rest of the reducers)
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentEvent: (state) => {
      state.currentEvent = null;
    },
    setSearch: (state, action) => {
      state.filters.search = action.payload;
    },
    setEvents: (state, action) => {
      // If the API returns events, overwrite the mock data
      state.events = action.payload; 
    },
    setCurrentEvent: (state, action) => {
     const eventId = action.payload;
  state.currentEvent = state.events.find(event => event._id === eventId) || null;
    }
  }
});

export const { setFilters, clearCurrentEvent, setSearch, setEvents, setCurrentEvent } = eventsSlice.actions;
export default eventsSlice.reducer;