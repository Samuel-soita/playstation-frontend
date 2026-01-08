import React, { memo, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dashboard as DashboardIcon,
  LocalCafe,
  Build,
  Logout
} from '@mui/icons-material';

interface NavigationProps {
  variant?: 'header' | 'sidebar';
  onItemClick?: () => void;
}

export const Navigation: React.FC<NavigationProps> = memo(({ variant = 'header', onItemClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  const navigationItems = useMemo(() => [
    {
      name: 'Dashboard',
      path: '/',
      icon: <DashboardIcon className="w-5 h-5" />,
      description: 'Overview & Analytics'
    },
    {
      name: 'Caffe',
      path: '/caffe',
      icon: <LocalCafe className="w-5 h-5" />,
      description: 'Management System'
    },
    {
      name: 'Operations',
      path: '/crud-operations',
      icon: <Build className="w-5 h-5" />,
      description: 'CRUD Operations'
    },
    {
      name: 'Start Gaming',
      path: '/game-session-workflow',
      icon: <span className="text-lg">🎯</span>,
      description: 'Game Session Workflow'
    }
  ], []);

  if (variant === 'header') {
    return (
      <>
        {/* Skip Navigation Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
        >
          Skip to main content
        </a>

        <header className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-600 shadow-2xl sticky top-0 z-50 border-b-4 border-yellow-300 relative overflow-hidden">
          {/* Animated Background Particles */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-2 left-1/4 w-2 h-2 bg-yellow-200 rounded-full animate-pulse"></div>
            <div className="absolute top-4 right-1/3 w-1 h-1 bg-amber-200 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute bottom-3 left-1/2 w-1.5 h-1.5 bg-orange-200 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-6 right-1/4 w-1 h-1 bg-yellow-300 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
          </div>

          {/* Gradient Overlay for Depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-300/10 to-transparent animate-pulse"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center group">
                {/* Enhanced Logo with Glow Effect */}
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-white via-yellow-100 to-amber-200 rounded-xl flex items-center justify-center mr-4 shadow-xl border-2 border-yellow-300 group-hover:scale-110 transition-all duration-300">
                    <span className="text-yellow-800 font-black text-lg animate-pulse">🎮</span>
                  </div>
                  {/* Logo Glow Effect */}
                  <div className="absolute inset-0 w-10 h-10 bg-yellow-400/30 rounded-xl blur-lg -z-10 group-hover:bg-yellow-400/50 transition-all duration-300"></div>
                </div>

                {/* Enhanced Title with Better Styling */}
                <div className="relative">
                  <h1 className="text-xl font-black bg-gradient-to-r from-white via-yellow-100 to-amber-200 bg-clip-text text-transparent animate-pulse-glow drop-shadow-lg">
                    PlayStation Digital System
                  </h1>
                  {/* Title Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-amber-400/20 blur-lg -z-10 animate-pulse"></div>
                </div>
              </div>

            {/* Desktop Navigation - Enhanced Gaming Style Pills */}
            <nav className="hidden md:flex items-center space-x-4">
              {navigationItems.map((item, index) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  aria-current={location.pathname === item.path ? 'page' : undefined}
                  aria-label={`Navigate to ${item.name} - ${item.description}`}
                  className={`relative group overflow-hidden px-10 py-4 rounded-full text-sm font-black tracking-wide transition-all duration-500 hover:scale-110 hover:-translate-y-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transform hover:rotate-1 ${
                    location.pathname === item.path
                      ? 'bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-white shadow-2xl shadow-yellow-400/60 border-4 border-yellow-300 animate-pulse-glow ring-4 ring-yellow-400/30'
                      : 'bg-gradient-to-r from-black/40 to-black/30 backdrop-blur-md text-yellow-100 hover:text-white border-2 border-yellow-400/40 hover:border-yellow-400/70 hover:bg-gradient-to-r hover:from-yellow-500/30 hover:to-amber-500/30 hover:shadow-xl hover:shadow-yellow-400/20'
                  }`}
                  style={{
                    animationDelay: `${index * 0.15}s`,
                    background: location.pathname === item.path
                      ? 'linear-gradient(135deg, #fbbf24, #f59e0b, #d97706, #ea580c)'
                      : 'linear-gradient(135deg, rgba(0,0,0,0.4), rgba(0,0,0,0.3))'
                  }}
                >
                  {/* Enhanced Animated Background Effect */}
                  <div className={`absolute inset-0 rounded-full transition-all duration-500 ${
                    location.pathname === item.path
                      ? 'bg-gradient-to-r from-yellow-300/30 to-amber-300/30 animate-pulse'
                      : 'bg-gradient-to-r from-yellow-400/0 to-amber-400/0 group-hover:from-yellow-400/15 group-hover:to-amber-400/15'
                  }`}></div>

                  {/* Shimmer Effect for Active State */}
                  {location.pathname === item.path && (
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse opacity-60"></div>
                  )}

                  {/* Content */}
                  <div className="relative z-10 flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      location.pathname === item.path
                        ? 'bg-white/25 scale-110 rotate-12 shadow-lg'
                        : 'bg-yellow-400/30 group-hover:bg-yellow-400/50 group-hover:scale-110 group-hover:rotate-12 group-hover:shadow-md'
                    }`}>
                      {item.icon}
                    </div>
                    <span className="drop-shadow-lg font-bold tracking-wider">{item.name}</span>
                  </div>

                  {/* Enhanced Floating Particles */}
                  {location.pathname === item.path && (
                    <>
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-300 rounded-full animate-ping opacity-80 shadow-lg"></div>
                      <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-amber-300 rounded-full animate-pulse opacity-70 shadow-md"></div>
                      <div className="absolute top-1 right-1 w-2 h-2 bg-orange-300 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.5s' }}></div>
                    </>
                  )}

                  {/* Enhanced Hover Glow Effect */}
                  <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-yellow-400/25 via-amber-400/25 to-orange-400/25 blur-2xl -z-10"></div>

                  {/* Border Glow Animation */}
                  <div className={`absolute inset-0 rounded-full border-2 transition-all duration-300 ${
                    location.pathname === item.path
                      ? 'border-yellow-300/60 shadow-2xl shadow-yellow-400/40'
                      : 'border-transparent group-hover:border-yellow-400/40 group-hover:shadow-lg group-hover:shadow-yellow-400/20'
                  }`}></div>
                </button>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              {/* Enhanced User Welcome */}
              <div className="hidden sm:flex items-center bg-gradient-to-r from-black/30 to-black/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-yellow-400/30 group hover:border-yellow-400/50 transition-all duration-300">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                <span className="text-yellow-100 text-sm font-bold tracking-wide">
                  Welcome, <span className="text-amber-200">{user}</span>
                </span>
                {/* User Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-amber-400/10 rounded-xl blur-sm -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Enhanced Logout Button */}
              <button
                onClick={handleLogout}
                className="relative p-3 text-yellow-100 hover:text-white rounded-xl transition-all duration-300 hover:scale-110 border border-yellow-400/40 hover:border-yellow-400/70 group overflow-hidden"
                title="Logout"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Logout className="w-5 h-5 relative z-10" />
                {/* Logout Glow Effect */}
                <div className="absolute inset-0 bg-red-400/20 rounded-xl blur-lg -z-10 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation - Gaming Style Pills */}
        <div className="md:hidden border-t-4 border-yellow-400/40 bg-gradient-to-r from-yellow-400/10 to-amber-400/10">
          <nav className="flex overflow-x-auto px-4 py-4 space-x-3 scrollbar-hide">
            {navigationItems.map((item, index) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`relative group flex-shrink-0 px-6 py-3 rounded-full text-sm font-black tracking-wide transition-all duration-500 hover:scale-110 ${
                  location.pathname === item.path
                    ? 'bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 text-white shadow-xl shadow-yellow-400/50 border-2 border-yellow-300 animate-pulse-glow'
                    : 'bg-gradient-to-r from-black/40 to-black/30 backdrop-blur-sm text-yellow-100 hover:text-white border border-yellow-400/40 hover:border-yellow-400/70'
                }`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  background: location.pathname === item.path
                    ? 'linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)'
                    : 'linear-gradient(135deg, rgba(0,0,0,0.4), rgba(0,0,0,0.3))'
                }}
              >
                {/* Animated Background Effect */}
                <div className={`absolute inset-0 rounded-full transition-all duration-500 ${
                  location.pathname === item.path
                    ? 'bg-gradient-to-r from-yellow-300/20 to-amber-300/20 animate-pulse'
                    : 'bg-gradient-to-r from-yellow-400/0 to-amber-400/0 group-hover:from-yellow-400/15 group-hover:to-amber-400/15'
                }`}></div>

                {/* Content */}
                <div className="relative z-10 flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                    location.pathname === item.path
                      ? 'bg-white/20 scale-110'
                      : 'bg-yellow-400/20 group-hover:bg-yellow-400/40 group-hover:scale-110'
                  }`}>
                    {item.icon}
                  </div>
                  <span className="hidden xs:inline drop-shadow-lg">{item.name}</span>
                </div>

                {/* Floating Particles */}
                {location.pathname === item.path && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-300 rounded-full animate-ping opacity-75"></div>
                )}

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-yellow-400/20 to-amber-400/20 blur-lg -z-10"></div>
              </button>
            ))}
          </nav>
        </div>
      </header>
      </>
    );
  }

  // Sidebar variant for Caffe page
  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-70 bg-gradient-to-b from-yellow-50 via-amber-50 to-orange-50 border-r-4 border-yellow-300 shadow-2xl transition-transform duration-300 z-40">
      <div className="p-6 border-b-4 border-yellow-300 bg-gradient-to-r from-yellow-100 to-amber-100">
        <h2 className="text-xl font-bold bg-gradient-to-r from-yellow-600 via-yellow-700 to-amber-700 bg-clip-text text-transparent">
          🧭 Navigation
        </h2>
        <p className="text-yellow-800 font-medium text-sm mt-1">System Access Points</p>
      </div>
      <nav className="flex flex-col gap-4 p-6">
        {navigationItems.map((item, index) => (
          <button
            key={item.path}
            onClick={() => {
              navigate(item.path);
              onItemClick?.();
            }}
            className={`relative group w-full overflow-hidden px-6 py-5 rounded-3xl text-sm font-black tracking-wide transition-all duration-500 hover:scale-105 hover:-translate-y-1 ${
              location.pathname === item.path
                ? 'bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 text-white shadow-2xl shadow-yellow-400/50 border-4 border-yellow-300 animate-pulse-glow'
                : 'bg-gradient-to-r from-white/90 to-yellow-50 text-gray-700 hover:text-yellow-800 border-2 border-transparent hover:border-yellow-400/60 hover:bg-gradient-to-r hover:from-yellow-100 hover:to-amber-100'
            }`}
            style={{
              animationDelay: `${index * 0.1}s`,
              background: location.pathname === item.path
                ? 'linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)'
                : 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(251,191,36,0.1))'
            }}
          >
            {/* Animated Background Effect */}
            <div className={`absolute inset-0 rounded-3xl transition-all duration-500 ${
              location.pathname === item.path
                ? 'bg-gradient-to-r from-yellow-300/20 to-amber-300/20 animate-pulse'
                : 'bg-gradient-to-r from-yellow-400/0 to-amber-400/0 group-hover:from-yellow-400/10 group-hover:to-amber-400/10'
            }`}></div>

            {/* Content */}
            <div className="relative z-10 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                location.pathname === item.path
                  ? 'bg-white/20 scale-110 rotate-12 shadow-lg'
                  : 'bg-gradient-to-br from-yellow-200 to-amber-200 group-hover:scale-110 group-hover:rotate-12 group-hover:shadow-lg'
              }`}>
                {item.icon}
              </div>
              <div className="text-left">
                <div className="font-bold text-lg drop-shadow-sm">{item.name}</div>
                <div className="text-xs opacity-80 font-medium">{item.description}</div>
              </div>
            </div>

            {/* Floating Particles */}
            {location.pathname === item.path && (
              <>
                <div className="absolute top-2 right-2 w-3 h-3 bg-yellow-300 rounded-full animate-ping opacity-75"></div>
                <div className="absolute bottom-2 left-2 w-2 h-2 bg-amber-300 rounded-full animate-pulse opacity-60"></div>
              </>
            )}

            {/* Hover Glow Effect */}
            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-yellow-400/20 via-amber-400/20 to-orange-400/20 blur-xl -z-10"></div>
          </button>
        ))}
      </nav>
    </aside>
  );
});