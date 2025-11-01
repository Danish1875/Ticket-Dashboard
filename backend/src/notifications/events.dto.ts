import { TicketStatus } from '../tickets/ticket.entity';

export class TicketCreatedEvent {
  ticketId: string;
  projectId: string;
  title: string;
  createdBy: string;
}

export class TicketMovedEvent {
  ticketId: string;
  projectId: string;
  title: string;
  oldStatus: TicketStatus;
  newStatus: TicketStatus;
  movedBy: string;
}

export class TicketUpdatedEvent {
  ticketId: string;
  projectId: string;
  title: string;
  updatedBy: string;
}