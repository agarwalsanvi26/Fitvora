import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SafeImage } from './SafeImage';
import {
  Dumbbell,
  Bell,
  Menu,
  X,
  User as UserIcon,
  Shield,
  CheckCircle,
  Sparkles,
  LogOut,
  Calendar,
  Flame,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, setCurrentPage }) => {
  const { currentUser, logoutUser, notifications, markNotificationRead } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const publicNavLinks = [
    { id: 'programs', label: 'Programs' },
    { id: 'trainers', label: 'Coaches' },
    { id: 'workout-planner', label: 'Planner' },
    { id: 'diet', label: 'Nutrition' },
    { id: 'blog', label: 'Journal' }
  ];

  const handleNav = (pageId: string) => {
    setCurrentPage(pageId);
    setMobileMenuOpen(false);
    setNotifDropdownOpen(false);
    setUserMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-[#F5F0E7]/95 backdrop-blur-md border-b border-[#E7DFD1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Wordmark */}
          <button
            type="button"
            onClick={() => handleNav('home')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 rounded-full bg-[#596044] text-[#F5F0E7] flex items-center justify-center">
              <Dumbbell className="w-4.5 h-4.5" />
            </div>
            <span className="font-logo text-xl font-bold tracking-widest text-[#303528] whitespace-nowrap">
              FITVORA
            </span>
          </button>

          {/* Primary Navigation */}
          <nav className="hidden lg:flex items-center gap-7">
            {publicNavLinks.map(link => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  className={`text-sm font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isActive
                      ? 'text-[#303528] border-b-2 border-[#596044] pb-0.5 font-semibold'
                      : 'text-[#1E211B]/75 hover:text-[#303528]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Utility Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => handleNav('ai-coach')}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold border whitespace-nowrap transition cursor-pointer ${
                currentPage === 'ai-coach'
                  ? 'bg-[#596044] text-white border-[#596044]'
                  : 'bg-white border-[#E7DFD1] text-[#303528] hover:bg-[#E7DFD1]/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C87555]" />
              <span>Coach</span>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotifDropdownOpen(!notifDropdownOpen);
                  setUserMenuOpen(false);
                }}
                className="relative p-2 rounded-full text-[#303528] hover:bg-[#E7DFD1] transition cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#C87555] text-white text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#E7DFD1] p-4 z-50">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E7DFD1]">
                    <h4 className="font-semibold text-sm text-[#303528]">Updates</h4>
                    <button
                      onClick={() => handleNav('notifications')}
                      className="text-xs text-[#596044] hover:underline font-medium"
                    >
                      View all
                    </button>
                  </div>
                  <div className="mt-3 space-y-2 max-h-72 overflow-y-auto">
                    {notifications.slice(0, 4).map(n => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationRead(n.id);
                          handleNav('notifications');
                        }}
                        className={`p-2.5 rounded-xl cursor-pointer text-xs transition ${
                          n.read ? 'bg-gray-50 text-gray-600' : 'bg-[#F5F0E7] text-[#303528] font-medium'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1 gap-2">
                          <span className="font-semibold text-[13px]">{n.title}</span>
                          <span className="text-[10px] text-gray-400 shrink-0">{n.createdAt}</span>
                        </div>
                        <p className="text-gray-600 line-clamp-2">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {currentUser ? (
              <div className="relative flex items-center gap-2">
                <button
                  onClick={() => {
                    setUserMenuOpen(!userMenuOpen);
                    setNotifDropdownOpen(false);
                  }}
                  className="flex items-center gap-2 p-1 pr-2.5 rounded-full bg-white border border-[#E7DFD1] hover:border-[#596044] transition cursor-pointer"
                >
                  <SafeImage
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    fallbackLabel={currentUser.name}
                    variant="avatar"
                    className="w-7 h-7 rounded-full object-cover text-xs"
                  />
                  <span className="text-xs font-semibold text-[#303528] hidden md:inline whitespace-nowrap">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                </button>

                <button
                  onClick={() =>
                    handleNav(
                      currentUser.role === 'ADMIN'
                        ? 'admin-dashboard'
                        : currentUser.role === 'TRAINER'
                        ? 'trainer-dashboard'
                        : 'user-dashboard'
                    )
                  }
                  className="hidden md:inline-flex px-4 py-2 rounded-full bg-[#596044] text-[#F5F0E7] text-xs font-semibold hover:bg-[#303528] transition whitespace-nowrap cursor-pointer"
                >
                  {currentUser.role === 'ADMIN'
                    ? 'Admin'
                    : currentUser.role === 'TRAINER'
                    ? 'Coach Desk'
                    : 'Dashboard'}
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-xl border border-[#E7DFD1] py-2 z-50">
                    <div className="px-4 py-2 border-b border-[#E7DFD1]">
                      <p className="text-[11px] text-gray-500">Signed in as</p>
                      <p className="text-sm font-semibold text-[#303528] truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-[#596044] font-medium mt-0.5">{currentUser.role}</p>
                    </div>

                    {currentUser.role === 'ADMIN' ? (
                      <button
                        onClick={() => handleNav('admin-dashboard')}
                        className="w-full text-left px-4 py-2 text-xs text-[#303528] hover:bg-[#F5F0E7] flex items-center gap-2"
                      >
                        <Shield className="w-4 h-4 text-[#C87555]" />
                        Studio Admin
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleNav('user-dashboard')}
                          className="w-full text-left px-4 py-2 text-xs text-[#303528] hover:bg-[#F5F0E7] flex items-center gap-2"
                        >
                          <Flame className="w-4 h-4 text-[#596044]" />
                          Overview
                        </button>
                        <button
                          onClick={() => handleNav('workout-planner')}
                          className="w-full text-left px-4 py-2 text-xs text-[#303528] hover:bg-[#F5F0E7] flex items-center gap-2"
                        >
                          <Calendar className="w-4 h-4 text-[#596044]" />
                          Workout Planner
                        </button>
                        <button
                          onClick={() => handleNav('diet')}
                          className="w-full text-left px-4 py-2 text-xs text-[#303528] hover:bg-[#F5F0E7] flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4 text-[#596044]" />
                          Nutrition Log
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => handleNav('profile')}
                      className="w-full text-left px-4 py-2 text-xs text-[#303528] hover:bg-[#F5F0E7] flex items-center gap-2"
                    >
                      <UserIcon className="w-4 h-4 text-[#596044]" />
                      Profile & Goals
                    </button>

                    <div className="border-t border-[#E7DFD1] my-1"></div>

                    <button
                      onClick={() => {
                        logoutUser();
                        handleNav('home');
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-700 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNav('login')}
                  className="text-xs font-semibold text-[#303528] hover:text-[#596044] px-3 py-2 whitespace-nowrap cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNav('register')}
                  className="px-4 py-2 rounded-full bg-[#596044] text-[#F5F0E7] text-xs font-semibold hover:bg-[#303528] transition whitespace-nowrap cursor-pointer"
                >
                  Get Started
                </button>
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#303528] hover:bg-[#E7DFD1]"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#F5F0E7] border-b border-[#E7DFD1] px-4 pt-2 pb-6 space-y-3">
          <div className="space-y-1">
            {publicNavLinks.map(link => (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className={`block w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium ${
                  currentPage === link.id ? 'bg-[#596044] text-white' : 'text-[#303528] hover:bg-[#E7DFD1]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-[#E7DFD1] space-y-2">
            <button
              onClick={() => handleNav('ai-coach')}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white border border-[#E7DFD1] text-xs font-semibold text-[#303528]"
            >
              <Sparkles className="w-4 h-4 text-[#C87555]" />
              Ask the Coach
            </button>

            {currentUser ? (
              <button
                onClick={() =>
                  handleNav(currentUser.role === 'ADMIN' ? 'admin-dashboard' : 'user-dashboard')
                }
                className="w-full py-3 rounded-xl bg-[#596044] text-[#F5F0E7] text-xs font-semibold text-center"
              >
                {currentUser.role === 'ADMIN' ? 'Open Admin' : 'Open Dashboard'}
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => handleNav('login')}
                  className="flex-1 py-2.5 rounded-xl bg-white border border-[#E7DFD1] text-xs font-semibold text-[#303528]"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNav('register')}
                  className="flex-1 py-2.5 rounded-xl bg-[#596044] text-white text-xs font-semibold"
                >
                  Create Account
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
