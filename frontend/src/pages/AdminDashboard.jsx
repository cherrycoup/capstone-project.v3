import { useEffect, useState } from "react";
import {
  Calendar,
  DollarSign,
  Package,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.jsx";
import { SimpleBarChart, SimpleLineChart } from "../components/ui/simple-charts.jsx";
import { appointmentsAPI, ordersAPI, packagesAPI, productsAPI } from "../utils/api.js";

const salesData = [
  { month: "Jan", sales: 12000 },
  { month: "Feb", sales: 15000 },
  { month: "Mar", sales: 18000 },
  { month: "Apr", sales: 16000 },
  { month: "May", sales: 22000 },
  { month: "Jun", sales: 25000 },
];

const ordersData = [
  { day: "Mon", orders: 45 },
  { day: "Tue", orders: 52 },
  { day: "Wed", orders: 48 },
  { day: "Thu", orders: 61 },
  { day: "Fri", orders: 55 },
  { day: "Sat", orders: 67 },
  { day: "Sun", orders: 43 },
];

const statusColor = (status) => {
  if (status === "Completed" || status === "Delivered") return "bg-green-100 text-green-700";
  if (status === "Confirmed" || status === "Processing") return "bg-blue-100 text-blue-700";
  if (status === "Cancelled") return "bg-red-100 text-red-700";
  return "bg-yellow-100 text-yellow-700";
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    appointments: 0,
    inventoryItems: 0,
    packageDeals: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [orderStats, appointments, products, packages, orders] = await Promise.all([
          ordersAPI.getStats(),
          appointmentsAPI.getAll(),
          productsAPI.getAll(),
          packagesAPI.getAll(true),
          ordersAPI.getAll(),
        ]);

        setStats({
          totalOrders: orderStats.data.data.totalOrders || 0,
          appointments: appointments.data.data?.length || 0,
          inventoryItems: products.data.data?.length || 0,
          packageDeals: packages.data.data?.length || 0,
          totalRevenue: orderStats.data.data.totalRevenue || 0,
        });
        setRecentOrders(orders.data.data?.slice(0, 4) || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const cards = [
    {
      title: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      change: "+12.5%",
      trend: "up",
      icon: ShoppingCart,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Appointments",
      value: stats.appointments.toLocaleString(),
      change: "+8.2%",
      trend: "up",
      icon: Calendar,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Inventory Items",
      value: stats.inventoryItems.toLocaleString(),
      change: "-3.1%",
      trend: "down",
      icon: Package,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Package Deals",
      value: stats.packageDeals.toLocaleString(),
      change: "Active store offers",
      trend: "up",
      icon: Package,
      color: "text-teal-600",
      bg: "bg-teal-50",
    },
    {
      title: "Total Revenue",
      value: `PHP ${stats.totalRevenue.toLocaleString()}`,
      change: "+15.3%",
      trend: "up",
      icon: DollarSign,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl md:text-3xl mb-2">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;

          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                    <p className="text-2xl mt-2">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendIcon
                        className={`w-4 h-4 ${
                          stat.trend === "up" ? "text-green-600" : "text-red-600"
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          stat.trend === "up" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bg}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleLineChart data={salesData} xKey="month" yKey="sales" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={ordersData} xKey="day" yKey="orders" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Order ID</th>
                  <th className="text-left py-3 px-4">Customer</th>
                  <th className="text-left py-3 px-4 hidden md:table-cell">Product</th>
                  <th className="text-left py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id} className="border-b last:border-0">
                    <td className="py-3 px-4">{order.referenceNumber}</td>
                    <td className="py-3 px-4">{order.customerId?.name || order.fullName || "Guest"}</td>
                    <td className="py-3 px-4 hidden md:table-cell">Customer order</td>
                    <td className="py-3 px-4">PHP {Number(order.total || 0).toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${statusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td className="py-8 px-4 text-center text-gray-500" colSpan={5}>
                      No recent orders yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
