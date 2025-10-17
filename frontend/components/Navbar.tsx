'use client';

import { useAuthStore } from '@/stores/authStore';
import { useUiStore } from '@/stores/uiStore';
import { useRouter } from 'next/navigation';
import { LogOut, Shield, Bell, User } from 'lucide-react';
import { useState } from 'react';
import SuperUserModal from './SuperUserModal';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { showSuperUserInfo, setShowSuperUserInfo } = useUiStore();
  const router = useRouter();
  const [showSuperUserModal, setShowSuperUserModal] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleToggleSuperUser = () => {
    if (showSuperUserInfo) {
      setShowSuperUserInfo(false);
    } else {
      setShowSuperUserModal(true);
    }
  };

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  TicketFlow
                </h1>
                <p className="text-xs text-slate-500">Project Management</p>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              {/* Super User Toggle */}
              <button
                onClick={handleToggleSuperUser}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  showSuperUserInfo
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">Super User</span>
              </button>

              {/* Notifications */}
              <button className="relative p-2 hover:bg-slate-100 rounded-xl transition">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">{user?.email}</p>
                  <p className="text-xs text-slate-500">Team Member</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Super User Modal */}
      {showSuperUserModal && (
        <SuperUserModal
          onClose={() => setShowSuperUserModal(false)}
          onSuccess={() => {
            setShowSuperUserInfo(true);
            setShowSuperUserModal(false);
          }}
        />
      )}
    </>
  );
}