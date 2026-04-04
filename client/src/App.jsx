import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Tasks from './pages/Tasks';
import CreateTask from './pages/CreateTask';
import Profile from './pages/Profile';
import Admin from './pages/Admin';

function AppLayout({ children }) {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 64 }}>
        {children}
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/*" element={
              <AppLayout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/create-task" element={
                    <ProtectedRoute>
                      <CreateTask />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin" element={
                    <ProtectedRoute adminOnly>
                      <Admin />
                    </ProtectedRoute>
                  } />
                </Routes>
              </AppLayout>
            } />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
