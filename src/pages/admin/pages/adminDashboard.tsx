import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, CreditCard, CalendarCheck, AlertTriangle } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

// Example dummy data
const tripData = [
  { date: "2025-09-01", completed: 25, missed: 3 },
  { date: "2025-09-02", completed: 30, missed: 1 },
  { date: "2025-09-03", completed: 28, missed: 2 },
  { date: "2025-09-04", completed: 32, missed: 0 },
];

const paymentData = [
  { date: "2025-09-01", amount: 120 },
  { date: "2025-09-02", amount: 200 },
  { date: "2025-09-03", amount: 150 },
  { date: "2025-09-04", amount: 250 },
];

const AdminDashboard = () => {
  const [fromDate, setFromDate] = useState("2025-09-01");
  const [toDate, setToDate] = useState("2025-09-04");

  return (
    <div className="p-4 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Total Vehicles</CardTitle>
            <Truck className="text-green-600" />
          </CardHeader>
          <CardContent className="text-2xl font-bold">12</CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Revenue Today</CardTitle>
            <CreditCard className="text-blue-600" />
          </CardHeader>
          <CardContent className="text-2xl font-bold">$450</CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Completed Trips</CardTitle>
            <CalendarCheck className="text-purple-600" />
          </CardHeader>
          <CardContent className="text-2xl font-bold">30</CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Missed Trips</CardTitle>
            <AlertTriangle className="text-red-600" />
          </CardHeader>
          <CardContent className="text-2xl font-bold">2</CardContent>
        </Card>
      </div>

      {/* Date Range */}
      <div className="flex items-center gap-4">
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border rounded-md p-2"
        />
        <span>to</span>
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border rounded-md p-2"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trips Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Trips Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={tripData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="#4ade80"
                  strokeWidth={3}
                  name="Completed Trips"
                />
                <Line
                  type="monotone"
                  dataKey="missed"
                  stroke="#f87171"
                  strokeWidth={3}
                  name="Missed Trips"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={paymentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#3b82f6" name="Payments" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
