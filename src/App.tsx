import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';

// Lazy load components for code splitting
const Login = lazy(() => import('@/components/Login/Login').then(module => ({ default: module.Login })));
const Dashboard = lazy(() => import('@/pages/Dashboard').then(module => ({ default: module.Dashboard })));
const Portal = lazy(() => import('@/pages/Portal').then(module => ({ default: module.Portal })));
const Caffe = lazy(() => import('@/pages/Caffe').then(module => ({ default: module.Caffe })));
const CrudOperations = lazy(() => import('@/pages/CrudOperations').then(module => ({ default: module.CrudOperations })));
const GameSessionWorkflowPage = lazy(() => import('@/pages/GameSessionWorkflow').then(module => ({ default: module.GameSessionWorkflowPage })));
const GameLibraryPage = lazy(() => import('@/pages/GameLibraryPage').then(module => ({ default: module.GameLibraryPage })));
const GameSpaceManagerPage = lazy(() => import('@/pages/GameSpaceManagerPage').then(module => ({ default: module.GameSpaceManagerPage })));

// Loading component for lazy-loaded routes
const LoadingFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
      <p className="text-muted-foreground">Loading PlayStation Digital System...</p>
    </div>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Portal />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/caffe"
                element={
                  <ProtectedRoute>
                    <Caffe />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/crud-operations"
                element={
                  <ProtectedRoute>
                    <CrudOperations />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/game-session-workflow"
                element={
                  <ProtectedRoute>
                    <GameSessionWorkflowPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/game-library"
                element={
                  <ProtectedRoute>
                    <GameLibraryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/game-space-manager"
                element={
                  <ProtectedRoute>
                    <GameSpaceManagerPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
      <PWAInstallPrompt />
    </ThemeProvider>
  );
}

export default App;
