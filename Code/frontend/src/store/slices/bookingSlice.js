import { createSlice } from '@reduxjs/toolkit';

const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    currentBooking: null,
    userBookings: [],
    selectedTickets: [],
    totalAmount: 0,
    isLoading: false,
  },
  reducers: {
    addTicket: (state, action) => {
      const existingTicket = state.selectedTickets.find(
        ticket => ticket.type === action.payload.type
      );

      if (existingTicket) {
        existingTicket.quantity += 1;
      } else {
        state.selectedTickets.push({ ...action.payload, quantity: 1 });
      }

      state.totalAmount = state.selectedTickets.reduce(
        (total, ticket) => total + ticket.price * ticket.quantity,
        0
      );
    },
    removeTicket: (state, action) => {
      const ticketIndex = state.selectedTickets.findIndex(
        ticket => ticket.type === action.payload.type
      );

      if (ticketIndex >= 0) {
        if (state.selectedTickets[ticketIndex].quantity > 1) {
          state.selectedTickets[ticketIndex].quantity -= 1;
        } else {
          state.selectedTickets.splice(ticketIndex, 1);
        }
      }

      state.totalAmount = state.selectedTickets.reduce(
        (total, ticket) => total + ticket.price * ticket.quantity,
        0
      );
    },
    setCurrentBooking: (state, action) => {
      state.currentBooking = action.payload;
    },
    clearBooking: (state) => {
      state.selectedTickets = [];
      state.totalAmount = 0;
      state.currentBooking = null;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { addTicket, removeTicket, setCurrentBooking, clearBooking, setLoading } =
  bookingSlice.actions;
export default bookingSlice.reducer;
