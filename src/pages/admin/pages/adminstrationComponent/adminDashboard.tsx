import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle,
  CalendarCheck,
  ClipboardCheck,
  CreditCard,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ✅ Role-based dashboard data
const dashboardData = {
  ADMIN: {
    stats: [
      {
        title: "Total Bookings",
        value: 120,
        icon: ClipboardCheck,
        color: "text-green-400",
      },
      {
        title: "Pending Bookings",
        value: 15,
        icon: AlertTriangle,
        color: "text-red-400",
      },
      {
        title: "Completed Bookings",
        value: 105,
        icon: CalendarCheck,
        color: "text-purple-400",
      },
      {
        title: "Revenue Today",
        value: "$450",
        icon: CreditCard,
        color: "text-blue-400",
      },
    ],
    bookings: [
      { date: "2025-09-01", completed: 25, pending: 5 },
      { date: "2025-09-02", completed: 30, pending: 3 },
      { date: "2025-09-03", completed: 28, pending: 7 },
      { date: "2025-09-04", completed: 32, pending: 0 },
    ],
    payments: [
      { date: "2025-09-01", amount: 120 },
      { date: "2025-09-02", amount: 200 },
      { date: "2025-09-03", amount: 150 },
      { date: "2025-09-04", amount: 250 },
    ],
    revenue: [
      { name: "Completed", value: 70 },
      { name: "Pending", value: 20 },
      { name: "Cancelled", value: 10 },
    ],
  },
  // ...OFFICER and BOOKER remain the same
};

const COLORS = ["#16a34a", "#fbbf24", "#dc2626"];

const AdminDashboard = () => {
  const [fromDate, setFromDate] = useState("2025-09-01");
  const [toDate, setToDate] = useState("2025-09-04");

  const role = useSelector(
    (state: RootState) => state.loginSlice.data?.user.role
  );

  const roleData =
    dashboardData[role as keyof typeof dashboardData] || dashboardData.ADMIN;
  const { stats, bookings, payments, revenue } = roleData;

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 dark:bg-[#0a1126] min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome to the Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-300 text-sm">
          Here’s a quick overview of your system’s status.
        </p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card
              key={i}
              className="hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0f1b3a]"
            >
              <CardHeader className="flex items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {stat.title}
                </CardTitle>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </CardHeader>
              <CardContent className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Separator className="border-gray-300 dark:border-gray-700" />

      {/* Date Range */}
      <div className="flex flex-wrap items-center gap-2 md:gap-4">
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border rounded-md p-2 bg-white dark:bg-[#1a2340] text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
        />
        <span className="text-gray-500 dark:text-gray-300">to</span>
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border rounded-md p-2 bg-white dark:bg-[#1a2340] text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 overflow-x-auto">
        {/* Bookings Overview */}
        <Card className="hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0f1b3a] lg:col-span-2 min-w-[300px]">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              Bookings Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bookings}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip wrapperClassName="bg-white dark:bg-[#1a2340] text-gray-900 dark:text-white" />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="#16a34a"
                  strokeWidth={2}
                  name="Completed"
                />
                <Line
                  type="monotone"
                  dataKey="pending"
                  stroke="#dc2626"
                  strokeWidth={2}
                  name="Pending"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Overview */}
        <Card className="hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0f1b3a] min-w-[300px]">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              Revenue Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenue}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={(props: { name: string; percent: number }) =>
                    `${props.name} ${(props.percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {revenue.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip wrapperClassName="bg-white dark:bg-[#1a2340] text-gray-900 dark:text-white" />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card className="hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0f1b3a] min-w-[300px]">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">
            Payment Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="text-gray-900 dark:text-white">
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{payment.date}</TableCell>
                    <TableCell>${payment.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
