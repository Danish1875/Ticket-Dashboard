'use client';

import { Ticket } from '@/stores/ticketStore';
import { useUiStore } from '@/stores/uiStore';
import { GripVertical, User, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface TicketCardProps {
  ticket: Ticket;
  onMove?: (ticketId: string, newStatus: string) => void;
}

export default function TicketCard({ ticket }: TicketCardProps) {
  const showSuperUserInfo = useUiStore((state) => state.showSuperUserInfo);

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md transition-all cursor-move group">
      <div className="flex items-start gap-3">
        <div className="opacity-0 group-hover:opacity-100 transition">
          <GripVertical className="w-4 h-4 text-slate-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-slate-900 mb-1 line-clamp-2">
            {ticket.title}
          </h4>
          {ticket.description && (
            <p className="text-sm text-slate-600 mb-3 line-clamp-2">
              {ticket.description}
            </p>
          )}

          {/* Super User Info */}
          {showSuperUserInfo && (
            <div className="space-y-2 mb-3 p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-100">
              <div className="flex items-center gap-2 text-xs">
                <User className="w-3 h-3 text-purple-600" />
                <span className="text-slate-600">Created by:</span>
                <span className="font-medium text-purple-700">{ticket.creator.email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <User className="w-3 h-3 text-pink-600" />
                <span className="text-slate-600">Updated by:</span>
                <span className="font-medium text-pink-700">{ticket.lastUpdatedBy.email}</span>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{format(new Date(ticket.createdAt), 'MMM d')}</span>
            </div>
            <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xs font-medium">
              {ticket.creator.email[0].toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}