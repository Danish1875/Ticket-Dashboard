'use client';

import { Ticket, TicketStatus } from '@/stores/ticketStore';
import TicketCard from './TicketCard';
import { Plus } from 'lucide-react';

interface KanbanColumnProps {
  title: string;
  status: TicketStatus;
  tickets: Ticket[];
  color: string;
  onAddTicket: () => void;
  onMoveTicket: (ticketId: string, newStatus: TicketStatus) => void;
}

export default function KanbanColumn({
  title,
  status,
  tickets,
  color,
  onAddTicket,
  onMoveTicket,
}: KanbanColumnProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const ticketId = e.dataTransfer.getData('ticketId');
    if (ticketId) {
      onMoveTicket(ticketId, status);
    }
  };

  const handleDragStart = (e: React.DragEvent, ticketId: string) => {
    e.dataTransfer.setData('ticketId', ticketId);
  };

  return (
    <div
      className="flex-shrink-0 w-80 bg-slate-50 rounded-2xl p-4"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${color}`}></div>
          <h3 className="font-semibold text-slate-900">{title}</h3>
          <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-full">
            {tickets.length}
          </span>
        </div>
        <button
          onClick={onAddTicket}
          className="p-1.5 hover:bg-white rounded-lg transition"
          title="Add ticket"
        >
          <Plus className="w-4 h-4 text-slate-600" />
        </button>
      </div>

      <div className="space-y-3 min-h-[200px]">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            draggable
            onDragStart={(e) => handleDragStart(e, ticket.id)}
          >
            <TicketCard ticket={ticket} />
          </div>
        ))}
        {tickets.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-sm">
            No tickets yet
          </div>
        )}
      </div>
    </div>
  );
}