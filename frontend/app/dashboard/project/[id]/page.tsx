'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useTicketStore, TicketStatus } from '@/stores/ticketStore';
import { projectsApi, ticketsApi } from '@/lib/api';
import Navbar from '@/components/Navbar';
import KanbanColumn from '@/components/KanbanColumn';
import CreateTicketModal from '@/components/CreateTicketModal';
import { ArrowLeft, MoreVertical } from 'lucide-react';

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  
  const { isAuthenticated } = useAuthStore();
  const { tickets, setTickets, moveTicket } = useTicketStore();
  
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus>('proposed');

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/');
      return;
    }

    fetchProjectAndTickets();
  }, [isAuthenticated, router, projectId]);

  const fetchProjectAndTickets = async () => {
    try {
      const [projectRes, ticketsRes] = await Promise.all([
        projectsApi.getOne(projectId),
        ticketsApi.getAll(projectId),
      ]);
      setProject(projectRes.data);
      setTickets(ticketsRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMoveTicket = async (ticketId: string, newStatus: TicketStatus) => {
    try {
      await ticketsApi.move(ticketId, newStatus);
      moveTicket(ticketId, newStatus);
    } catch (error) {
      console.error('Failed to move ticket:', error);
    }
  };

  const handleAddTicket = (status: TicketStatus) => {
    setSelectedStatus(status);
    setShowCreateModal(true);
  };

  const columns = [
    { title: 'Proposed', status: 'proposed' as TicketStatus, color: 'bg-purple-500' },
    { title: 'To Do', status: 'todo' as TicketStatus, color: 'bg-blue-500' },
    { title: 'In Progress', status: 'in_progress' as TicketStatus, color: 'bg-yellow-500' },
    { title: 'Done', status: 'done' as TicketStatus, color: 'bg-green-500' },
    { title: 'Deployed', status: 'deployed' as TicketStatus, color: 'bg-pink-500' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Loading project...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <p className="text-slate-600">Project not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <Navbar />

      <div className="max-w-[1600px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Projects</span>
          </button>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">{project.name}</h1>
                <p className="text-slate-600">{project.description || 'No description'}</p>
              </div>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                <MoreVertical className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100">
              <div className="text-sm">
                <span className="text-slate-600">Created by:</span>{' '}
                <span className="font-medium text-slate-900">{project.creator.email}</span>
              </div>
              <div className="text-sm">
                <span className="text-slate-600">Total Tickets:</span>{' '}
                <span className="font-medium text-slate-900">{tickets.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {columns.map((column) => (
              <KanbanColumn
                key={column.status}
                title={column.title}
                status={column.status}
                tickets={tickets.filter((t) => t.status === column.status)}
                color={column.color}
                onAddTicket={() => handleAddTicket(column.status)}
                onMoveTicket={handleMoveTicket}
              />
            ))}
          </div>
        </div>

        {/* Empty State */}
        {tickets.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No tickets yet</h3>
            <p className="text-slate-600 mb-4">Start by creating your first ticket in any column</p>
          </div>
        )}
      </div>

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <CreateTicketModal
          projectId={projectId}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
}