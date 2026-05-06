import { useState } from 'react';
import {
  Building2,
  Calendar,
  ChartNoAxesCombined,
  Home,
  LogOut,
  Package,
  PackagePlus,
  Settings,
  ShoppingCart,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <Home />, isParent: true },
    { name: "Orders", path: "/admin/orders", icon: <ShoppingCart />, isParent: false },
    { name: "Appointments", path: "/admin/appointments", icon: <Calendar />, isParent: false },
    { name: "Inventory", path: "/admin/inventory", icon: <Package />, isParent: false },
    { name: "Package Deals", path: "/admin/packages", icon: <PackagePlus />, isParent: false },
    { name: "Reports", path: "/admin/reports", icon: <ChartNoAxesCombined />, isParent: false },
    { name: "Settings", path: "/admin/settings", icon: <Settings />, isParent: false },
  ];

  return (
    <>
      {/* ✅ Overlay (mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ✅ Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static h-screen`}
      >
        <div className="flex flex-col h-full">

          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-blue-400" />
              <div>
                <h1 className="font-bold text-lg">JBM ELECTRO</h1>
                <p className="text-xs text-gray-400">VENTURES</p>
              </div>  
            </div>

            {/* ❌ Close button (mobile only) */}
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden"
            >
              <X size={24} />
            </button>
          </div>

          {/* Menu */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.isParent}
                onClick={() => setIsOpen(false)} // auto close on mobile
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                {user?.profileImageUrl ? (
                  <img src={user.profileImageUrl} alt="" className="h-full w-full object-cover rounded-full" />
                ) : (
                  <span className="text-sm">{user?.name?.[0]?.toUpperCase() || "A"}</span>
                )}
              </div>
              <div className="flex-1">
              <p className="text-sm">{user?.name || "Admin User"}</p>
              <p className="text-xs text-gray-400">{user?.email || "admin@jbm.com"}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>

        </div>
      </aside>

      {/* ✅ OPEN BUTTON (you NEED this somewhere in your layout) */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-3 m-3 bg-gray-900 text-white rounded-lg lg:hidden"
      >
        ☰
      </button>
    </>
  );
};

export default Sidebar;
