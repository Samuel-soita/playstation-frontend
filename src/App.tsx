import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Login } from '@/components/Login/Login';
import { Dashboard } from '@/pages/Dashboard';
import { Portal } from '@/pages/Portal';
import { Caffe } from '@/pages/Caffe';
import { CrudOperations } from '@/pages/CrudOperations';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
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
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      <PWAInstallPrompt />
    </ThemeProvider>
  );
}

export default App;
