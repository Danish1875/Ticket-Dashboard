import { create } from 'zustand';

export type TicketStatus = 'proposed' | 'todo' | 'in_progress' | 'done' | 'deployed';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  projectId: string;
  creatorId: string;
  lastUpdatedById: string;
  creator: {
    id: string;
    email: string;
  };
  lastUpdatedBy: {
    id: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface TicketState {
  tickets: Ticket[];
  setTickets: (tickets: Ticket[]) => void;
  addTicket: (ticket: Ticket) => void;
  updateTicket: (id: string, ticket: Partial<Ticket>) => void;
  moveTicket: (id: string, status: TicketStatus) => void;
  removeTicket: (id: string) => void;
}

export const useTicketStore = create<TicketState>((set) => ({
  tickets: [],
  setTickets: (tickets) => set({ tickets }),
  addTicket: (ticket) => set((state) => ({ tickets: [ticket, ...state.tickets] })),
  updateTicket: (id, updatedTicket) =>
    set((state) => ({
      tickets: state.tickets.map((t) => (t.id === id ? { ...t, ...updatedTicket } : t)),
    })),
  moveTicket: (id, status) =>
    set((state) => ({
      tickets: state.tickets.map((t) => (t.id === id ? { ...t, status } : t)),
    })),
  removeTicket: (id) => set((state) => ({ tickets: state.tickets.filter((t) => t.id !== id) })),
}));