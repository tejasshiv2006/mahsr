import { create } from 'zustand';

export interface Ticket {
  id: string;
  bookingId: string;
  passengerName: string;
  trainId: string;
  trainName: string;
  trainNumber: string;
  fromStation: string;
  toStation: string;
  travelDate: string;
  departureTime: string;
  arrivalTime: string;
  seats: string[];
  seatClass: 'standard' | 'business';
  fare: number;
  qrData: string;
  generatedAt: string;
}

interface TicketState {
  tickets: Ticket[];
  addTicket: (ticket: Ticket) => void;
  removeTicket: (id: string) => void;
}

export const useTicketStore = create<TicketState>((set) => ({
  tickets: [],
  addTicket: (ticket) => set((state) => ({ tickets: [ticket, ...state.tickets] })),
  removeTicket: (id) => set((state) => ({
    tickets: state.tickets.filter((ticket) => ticket.id !== id),
  })),
}));
