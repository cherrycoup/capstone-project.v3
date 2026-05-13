import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'sonner';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ClientDashboard from './pages/ClientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Inventory from './pages/Inventory';
import Orders from './pages/Orders';
import Customers from './pages/Customers';
import Appointments from './pages/Appointments';
import AdminPackages from './pages/AdminPackages';
import StaffManagement from './pages/StaffManagement';
import ClientHomepage from './pages/ClientHomepage';
import ClientTracking from './pages/ClientTracking';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import ProtectedRoutes from './utils/ProtectedRoutes';
import Sidebar from './components/Sidebar';

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          
          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoutes requireRole={['Admin', 'admin']}>
                <div style={styles.layoutContainer}>
                  <Sidebar />
                  <div style={styles.mainContent}>
                    <Routes>
                      <Route path="/" element={<AdminDashboard />} />
                      <Route path="/dashboard" element={<AdminDashboard />} />
                      <Route path="/inventory" element={<Inventory />} />
                      <Route path="/packages" element={<AdminPackages />} />
                      <Route path="/orders" element={<Orders />} />
                      <Route path="/customers" element={<Customers />} />
                      <Route path="/staff" element={<StaffManagement />} />
                      <Route path="/appointments" element={<Appointments />} />
                      <Route path="/reports" element={<Reports />} />
                      <Route path="/settings" element={<Settings />} />
                    </Routes>
                  </div>
                </div>
              </ProtectedRoutes>
            }
          />

          {/* Customer Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoutes requireRole={['customer']}>
                <ClientDashboard />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/tracking"
            element={
              <ProtectedRoutes requireRole={['customer']}>
                <ClientTracking />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoutes requireRole={['customer']}>
                <Settings />
              </ProtectedRoutes>
            }
          />

          {/* Landing Page */}
          <Route path="/" element={<ClientHomepage />} />
        </Routes>
      </Router>
      <Toaster />
    </CartProvider>
    </AuthProvider>
  )
}

const styles = {
  layoutContainer: {
    display: "flex",
    height: "100vh"
  },
  mainContent: {
    flex: 1,
    overflow: "auto",
    backgroundColor: "#f5f5f5"
  }
}

export default App
