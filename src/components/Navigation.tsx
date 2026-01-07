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

        <header className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-600 shadow-2xl sticky top-0 z-50 border-b-4 border-yellow-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-white to-yellow-100 rounded-xl flex items-center justify-center mr-3 shadow-lg border-2 border-yellow-300">
                <span className="text-yellow-800 font-bold text-sm">🎮</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent animate-pulse-glow">
                PlayStation Digital System
              </h1>
            </div>

            {/* Desktop Navigation - Gaming Style Pills */}
            <nav className="hidden md:flex items-center space-x-3">
              {navigationItems.map((item, index) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  aria-current={location.pathname === item.path ? 'page' : undefined}
                  aria-label={`Navigate to ${item.name} - ${item.description}`}
                  className={`relative group overflow-hidden px-8 py-4 rounded-full text-sm font-black tracking-wide transition-all duration-500 hover:scale-110 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 ${
                    location.pathname === item.path
                      ? 'bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 text-white shadow-2xl shadow-yellow-400/50 border-4 border-yellow-300 animate-pulse-glow'
                      : 'bg-gradient-to-r from-black/30 to-black/20 backdrop-blur-sm text-yellow-100 hover:text-white border-2 border-yellow-400/30 hover:border-yellow-400/60 hover:bg-gradient-to-r hover:from-yellow-500/20 hover:to-amber-500/20'
                  }`}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    background: location.pathname === item.path
                      ? 'linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)'
                      : 'linear-gradient(135deg, rgba(0,0,0,0.3), rgba(0,0,0,0.2))'
                  }}
                >
                  {/* Animated Background Effect */}
                  <div className={`absolute inset-0 rounded-full transition-all duration-500 ${
                    location.pathname === item.path
                      ? 'bg-gradient-to-r from-yellow-300/20 to-amber-300/20 animate-pulse'
                      : 'bg-gradient-to-r from-yellow-400/0 to-amber-400/0 group-hover:from-yellow-400/10 group-hover:to-amber-400/10'
                  }`}></div>

                  {/* Content */}
                  <div className="relative z-10 flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                      location.pathname === item.path
                        ? 'bg-white/20 scale-110 rotate-12'
                        : 'bg-yellow-400/20 group-hover:bg-yellow-400/40 group-hover:scale-110 group-hover:rotate-12'
                    }`}>
                      {item.icon}
                    </div>
                    <span className="drop-shadow-lg">{item.name}</span>
                  </div>

                  {/* Floating Particles */}
                  {location.pathname === item.path && (
                    <>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full animate-ping opacity-75"></div>
                      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-amber-300 rounded-full animate-pulse opacity-60"></div>
                    </>
                  )}

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-yellow-400/20 via-amber-400/20 to-orange-400/20 blur-xl -z-10"></div>
                </button>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <span className="text-yellow-100 text-sm font-semibold hidden sm:block bg-black/20 px-3 py-1 rounded-lg">
                Welcome, {user}
              </span>
              <button
                onClick={handleLogout}
                className="p-3 text-white hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-110 border border-white/20"
                title="Logout"
              >
                <Logout className="w-5 h-5" />
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