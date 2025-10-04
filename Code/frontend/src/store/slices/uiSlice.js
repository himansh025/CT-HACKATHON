// Event-App/frontend/src/store/slices/uiSlice.js

import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    isMobileMenuOpen: false,
    activeModal: null,
    toast: null,
    searchQuery: '',
    showLoginNotification: false, // Controls login success/failure popup
    notificationData: {          // Stores notifications from API
      newEvents: [],
      upcomingAlerts: []
    }
  },
  reducers: {
    // Mobile Menu
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    closeMobileMenu: (state) => {
      state.isMobileMenuOpen = false;
    },

    // Modals
    openModal: (state, action) => {
      state.activeModal = action.payload;
    },
    closeModal: (state) => {
      state.activeModal = null;
    },

    // Toasts
    showToast: (state, action) => {
      state.toast = action.payload;
    },
    hideToast: (state) => {
      state.toast = null;
    },

    // Search Query
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },

    // Login Notification Popup
    setShowLoginNotification: (state, action) => {
      state.showLoginNotification = action.payload;
    },

    // Notifications Data
    setNotificationData: (state, action) => {
      // Ensure we always keep the structure consistent
      state.notificationData = {
        newEvents: action.payload?.newEvents || [],
        upcomingAlerts: action.payload?.upcomingAlerts || []
      };
    },
  },
});

export const { 
  toggleMobileMenu, 
  closeMobileMenu, 
  openModal, 
  closeModal, 
  showToast, 
  hideToast,
  setSearchQuery,
  setShowLoginNotification,
  setNotificationData 
} = uiSlice.actions;

export default uiSlice.reducer;
