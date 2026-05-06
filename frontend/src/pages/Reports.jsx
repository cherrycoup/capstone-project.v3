import { DollarSign, Download, ShoppingCart, TrendingUp, Users } from "lucide-react";
import { Button } from "../components/ui/button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select.jsx";
import { SimpleBarChart, SimpleLineChart } from "../components/ui/simple-charts.jsx";

const salesData = [
  { month: "Jan", revenue: 125000, orders: 45, customers: 38 },
  { month: "Feb", revenue: 145000, orders: 52, customers: 42 },
  { month: "Mar", revenue: 165000, orders: 58, customers: 48 },
  { month: "Apr", revenue: 152000, orders: 54, customers: 45 },
  { month: "May", revenue: 185000, orders: 65, customers: 55 },
  { month: "Jun", revenue: 198000, orders: 70, customers: 58 },
];

const categoryData = [
  { category: "Lighting", sales: 185000 },
  { category: "Wiring", sales: 145000 },
  { category: "Safety", sales: 125000 },
  { category: "Outlets", sales: 98000 },
  { category: "Cables", sales: 85000 },
];

const productPerformance = [
  { product: "LED Bulbs", sold: 450, revenue: 24750 },
  { product: "Electrical Wires", sold: 380, revenue: 62700 },
  { product: "Circuit Breakers", sold: 120, revenue: 73800 },
  { product: "Power Outlets", sold: 290, revenue: 36250 },
  { product: "Extension Cords", sold: 210, revenue: 52500 },
];

const customerMetrics = [
  { metric: "Total Customers", value: "1,234", change: "+12.5%" },
  { metric: "New Customers", value: "89", change: "+8.2%" },
  { metric: "Repeat Customers", value: "456", change: "+15.3%" },
  { metric: "Customer Retention", value: "78%", change: "+3.1%" },
];

export default function Reports() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl mb-2">Reports & Analytics</h1>
          <p className="text-gray-500">Comprehensive business insights and analytics</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="6months">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Metric title="Total Revenue" value="PHP 970,000" note="+18.5% vs last period" icon={DollarSign} color="text-green-600" />
        <Metric title="Total Orders" value="344" note="+12.3% vs last period" icon={ShoppingCart} color="text-blue-600" />
        <Metric title="Total Customers" value="286" note="+15.2% vs last period" icon={Users} color="text-purple-600" />
        <Metric title="Avg Order Value" value="PHP 2,820" note="+5.8% vs last period" icon={TrendingUp} color="text-orange-600" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleLineChart data={salesData} xKey="month" yKey="revenue" color="#3b82f6" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleBarChart data={categoryData} xKey="category" yKey="sales" color="#3b82f6" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {productPerformance.map((product, index) => (
                <div key={product.product} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                      {index + 1}
                    </div>
                    <div>
                      <p>{product.product}</p>
                      <p className="text-sm text-gray-500">{product.sold} units sold</p>
                    </div>
                  </div>
                  <p>PHP {product.revenue.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {customerMetrics.map((metric) => (
              <div key={metric.metric} className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-2">{metric.metric}</p>
                <p className="text-2xl mb-1">{metric.value}</p>
                <p className="text-sm text-green-600">{metric.change}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customer Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleLineChart data={salesData} xKey="month" yKey="customers" color="#8b5cf6" />
        </CardContent>
      </Card>
    </div>
  );
}

function Metric({ title, value, note, icon, color }) {
  const Icon = icon;
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl mt-2">{value}</p>
            <p className="text-sm text-green-600 mt-1">{note}</p>
          </div>
          <Icon className={`w-8 h-8 ${color}`} />
        </div>
      </CardContent>
    </Card>
  );
}
