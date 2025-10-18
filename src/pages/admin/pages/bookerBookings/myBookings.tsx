import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { listMyBookingsFn } from "@/redux/slices/bookings/myBooking";
import type { iListedMyBookingsPayload, Booking } from "@/redux/types/booking";

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Icons
import {
  Calendar,
  DollarSign,
  MapPin,
  CreditCard,
  User,
  Phone,
  Search,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";

const MyBookings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.listMyBookingsSlice
  );

  // Local state
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPayment, setFilterPayment] = useState("all");

  // Fetch data
  useEffect(() => {
    const payload: iListedMyBookingsPayload = {
      page: currentPage,
      perPage: perPage,
    };
    dispatch(listMyBookingsFn(payload));
  }, [dispatch, currentPage, perPage]);

  // Filter bookings based on search and filters
  const filteredBookings =
    data.bookings?.filter((booking: Booking) => {
      const matchesSearch =
        booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.phoneNumber.includes(searchTerm) ||
        booking.ride.route.from
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        booking.ride.route.end.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "recent" && isRecent(booking.createdAt)) ||
        (filterStatus === "old" && !isRecent(booking.createdAt));

      const matchesPayment =
        filterPayment === "all" ||
        booking.paymentType.toLowerCase() === filterPayment.toLowerCase();

      return matchesSearch && matchesStatus && matchesPayment;
    }) || [];

  // Helper function to check if booking is recent (within last 7 days)
  const isRecent = (date: Date | string) => {
    const bookingDate = typeof date === "string" ? new Date(date) : date;
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - bookingDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  // Calculate statistics
  const totalBookings = data.bookings?.length || 0;
  const totalAmount =
    data.bookings?.reduce((sum, booking) => sum + booking.total_amount, 0) || 0;
  const recentBookings =
    data.bookings?.filter((booking) => isRecent(booking.createdAt)).length || 0;
  const averageAmount =
    totalBookings > 0 ? Math.round(totalAmount / totalBookings) : 0;

  // Payment type colors
  const getPaymentTypeColor = (paymentType: string) => {
    switch (paymentType.toLowerCase()) {
      case "edahab":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "zaad":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "cash":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default:
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    }
  };

  // Format date
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle refresh
  const handleRefresh = () => {
    const payload: iListedMyBookingsPayload = {
      page: currentPage,
      perPage: perPage,
    };
    dispatch(listMyBookingsFn(payload));
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Stats Cards Component
  const StatsCard = ({
    title,
    value,
    icon: Icon,
    description,
  }: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    description?: string;
  }) => (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </div>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );

  // Loading skeleton
  if (loading && !data.bookings) {
    return (
      <div className="space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-32 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Bookings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and track your booking history
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Bookings"
          value={totalBookings}
          icon={Calendar}
          description="All time bookings"
        />
        <StatsCard
          title="Total Amount"
          value={`$${totalAmount.toLocaleString()}`}
          icon={DollarSign}
          description="USD spent"
        />
        <StatsCard
          title="Recent Bookings"
          value={recentBookings}
          icon={Clock}
          description="Last 7 days"
        />
        <StatsCard
          title="Average Amount"
          value={`$${averageAmount.toLocaleString()}`}
          icon={CreditCard}
          description="Per booking"
        />
      </div>

      {/* Filters and Search */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg">Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-40 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="recent">Recent</SelectItem>
                <SelectItem value="old">Older</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPayment} onValueChange={setFilterPayment}>
              <SelectTrigger className="w-full sm:w-40 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <SelectValue placeholder="Payment" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <SelectItem value="all">All Payment</SelectItem>
                <SelectItem value="edahab">eDahab</SelectItem>
                <SelectItem value="zaad">ZAAD</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Bookings ({filteredBookings.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredBookings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No bookings found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm || filterStatus !== "all" || filterPayment !== "all"
                  ? "Try adjusting your filters"
                  : "You haven't made any bookings yet"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="dark:border-gray-700">
                    <TableHead className="dark:text-gray-300">
                      Booking ID
                    </TableHead>
                    <TableHead className="dark:text-gray-300">Route</TableHead>
                    <TableHead className="dark:text-gray-300">
                      Passenger
                    </TableHead>
                    <TableHead className="dark:text-gray-300">Amount</TableHead>
                    <TableHead className="dark:text-gray-300">
                      Payment
                    </TableHead>
                    <TableHead className="dark:text-gray-300">Date</TableHead>
                    <TableHead className="dark:text-gray-300">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking: Booking) => (
                    <TableRow
                      key={booking.id}
                      className="dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <TableCell className="font-mono text-sm text-gray-600 dark:text-gray-300">
                        {booking.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {booking.ride.route.from} →{" "}
                              {booking.ride.route.end}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {booking.qty} ticket{booking.qty > 1 ? "s" : ""}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {booking.name}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                              <Phone className="h-3 w-3" />
                              {booking.phoneNumber}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-right">
                          <div className="font-medium text-gray-900 dark:text-white">
                            ${booking.total_amount.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {booking.currency}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${getPaymentTypeColor(
                            booking.paymentType
                          )} border-0`}
                        >
                          {booking.paymentType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-300">
                        {formatDate(booking.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {isRecent(booking.createdAt) ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-green-600 dark:text-green-400 text-sm">
                                Recent
                              </span>
                            </>
                          ) : (
                            <>
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-500 dark:text-gray-400 text-sm">
                                Older
                              </span>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {data.meta && data.meta.totalPages > 1 && (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {(currentPage - 1) * perPage + 1} to{" "}
                {Math.min(currentPage * perPage, data.meta.total)} of{" "}
                {data.meta.total} bookings
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: Math.min(5, data.meta.totalPages) },
                    (_, i) => {
                      const page = i + 1;
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className={`${
                            currentPage === page
                              ? "dark:bg-blue-600 dark:text-white"
                              : "dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          }`}
                        >
                          {page}
                        </Button>
                      );
                    }
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === data.meta.totalPages}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyBookings;
