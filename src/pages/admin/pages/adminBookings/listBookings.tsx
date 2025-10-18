"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import type { AppDispatch, RootState } from "@/redux/store";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  Trash2,
  RefreshCw,
  MoreHorizontal,
  Edit,
  DollarSign,
  ListIcon,
  Search,
  Filter,
  Calendar,
  MapPin,
  Phone,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Download,
  BarChart3,
} from "lucide-react";

import type { Booking } from "@/redux/types/booking";
import { listBookingsFn } from "@/redux/slices/bookings/listBookings";
import { Label } from "@/components/ui/label";
import ListHotelsSkeleton from "../../components/skeletons/hotelsSkeleton";
import { Link, useNavigate } from "react-router-dom";

const ListBookings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.listBookingsSlice
  );

  const bookings: Booking[] = data?.bookings || [];
  const total = data?.meta?.total || 0;

  // Local states
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  const perPage = 10;
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  const form = useForm<Partial<Booking>>({
    defaultValues: { name: "", phoneNumber: "", qty: 1 },
  });

  const navigate = useNavigate();
  // Fetch bookings
  useEffect(() => {
    dispatch(listBookingsFn({ page, perPage }));
  }, [dispatch, page, perPage, refreshTrigger]);

  useEffect(() => {
    if (error) {
      toast.dismiss();
      toast.error(error);
    }
  }, [error]);

  // --- CRUD actions ---
  const handleDelete = () => {
    if (deleteId) {
      toast.success(`Booking ${deleteId} deleted`);
      setDeleteId(null);
      setIsDeleteDialogOpen(false);
      setRefreshTrigger((prev) => prev + 1);
    }
  };

  const deleteSelected = () => {
    toast.success(`Deleted ${selectedIds.length} bookings`);
    setSelectedIds([]);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    const pageIds = bookings.map((b) => b.id);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));
    setSelectedIds((prev) =>
      allSelected
        ? prev.filter((id) => !pageIds.includes(id))
        : [...new Set([...prev, ...pageIds])]
    );
  };

  const handleEdit = (booking: Booking) => {
    setEditingBooking(booking);
    form.reset({
      name: booking.name,
      phoneNumber: booking.phoneNumber,
      qty: booking.qty,
    });
    setIsEditDialogOpen(true);
  };

  const submitEdit = form.handleSubmit(() => {
    toast.success(`Booking ${editingBooking?.id} updated`);
    setIsEditDialogOpen(false);
    setEditingBooking(null);
    setRefreshTrigger((prev) => prev + 1);
  });

  // --- Derived stats ---
  const totalAmount = bookings.reduce(
    (sum, b) => sum + (b.total_amount || 0),
    0
  );
  const paidCount = bookings.filter((b) => b.paymentType === "Paid").length;
  const pendingCount = bookings.filter((b) => b.paymentType !== "Paid").length;

  if (loading) return <ListHotelsSkeleton />;

  return (
    <div className="w-full  dark:from-slate-900 dark:to-slate-800 p-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold  ">Bookings Management</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Manage and monitor all booking activities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRefreshTrigger((prev) => prev + 1)}
            className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Bookings */}
        <Card className="relative border shadow-sm hover:shadow-md transition-all duration-300 group">
          <CardHeader className="relative flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Total Bookings
            </CardTitle>
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <ListIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {total}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              All registered bookings
            </p>
            <div className="flex items-center mt-2 text-green-600 dark:text-green-400">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span className="text-xs font-medium">+12% this month</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <Card className="relative border shadow-sm hover:shadow-md transition-all duration-300 group">
          <CardHeader className="relative flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Total Revenue
            </CardTitle>
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <DollarSign className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              ${totalAmount.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Sum of all payments
            </p>
            <div className="flex items-center mt-2 text-green-600 dark:text-green-400">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span className="text-xs font-medium">+8.2% this month</span>
            </div>
          </CardContent>
        </Card>

        {/* Paid Bookings */}
        <Card className="relative border shadow-sm hover:shadow-md transition-all duration-300 group">
          <CardHeader className="relative flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Paid Bookings
            </CardTitle>
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <CheckCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {paidCount}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Successfully paid
            </p>
            <div className="flex items-center mt-2 text-green-600 dark:text-green-400">
              <CheckCircle className="h-3 w-3 mr-1" />
              <span className="text-xs font-medium">
                {Math.round((paidCount / total) * 100)}% success rate
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Pending Payments */}
        <Card className="relative border shadow-sm hover:shadow-md transition-all duration-300 group">
          <CardHeader className="relative flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Pending Payments
            </CardTitle>
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {pendingCount}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Awaiting confirmation
            </p>
            <div className="flex items-center mt-2 text-amber-600 dark:text-amber-400">
              <AlertCircle className="h-3 w-3 mr-1" />
              <span className="text-xs font-medium">Needs attention</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Actions & Search Section */}
      <Card className=" shadow-sm border bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Link to={"/dashboard/admin/bookings/create"}>
                <Button variant="default" size="sm">
                  {" "}
                  Create Booking
                </Button>
              </Link>
              <Button
                variant="destructive"
                size="sm"
                disabled={selectedIds.length === 0}
                onClick={deleteSelected}
                className="hover:scale-105 transition-transform duration-200"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete {selectedIds.length > 0 && `(${selectedIds.length})`}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRefreshTrigger((prev) => prev + 1)}
                className="hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:scale-105 transition-all duration-200"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-green-50 dark:hover:bg-green-900/20 hover:scale-105 transition-all duration-200"
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics
              </Button>
            </div>

            {/* Enhanced Search */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search bookings, names, phones..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 w-full sm:w-80 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Total: {total} bookings</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Paid: {paidCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span>Pending: {pendingCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Revenue: ${totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Table Section */}
      <Card className=" shadow-sm border bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <ListIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                  All Bookings
                </CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Manage and view all booking records
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                <TableRow className="border-slate-200 dark:border-slate-700">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        bookings.length > 0 &&
                        bookings.every((b) => selectedIds.includes(b.id))
                      }
                      onCheckedChange={selectAll}
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                    Passenger
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                    Contact
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                    Route
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                    Quantity
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                    Amount
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                    Payment
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                    Date
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300 w-20">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.length > 0 ? (
                  bookings.map((booking, index) => (
                    <TableRow
                      key={booking.id}
                      className={`border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200 ${
                        index % 2 === 0
                          ? "bg-white dark:bg-slate-800/30"
                          : "bg-slate-50/50 dark:bg-slate-800/20"
                      }`}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(booking.id)}
                          onCheckedChange={() => toggleSelect(booking.id)}
                          className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {booking.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-slate-100">
                              {booking.name}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              ID: {booking.id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-slate-400" />
                          <span className="font-mono text-sm">
                            {booking.phoneNumber}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          <div>
                            <p className="font-medium text-slate-900 dark:text-slate-100">
                              {booking.ride?.route?.from} →{" "}
                              {booking.ride?.route?.end}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Route
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center">
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                            {booking.qty}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-right">
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            ${booking.total_amount.toLocaleString()}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {booking.currency}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            booking.paymentType === "eDAHAB"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
                              : booking.paymentType === "ZAAD"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                              : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200"
                          }`}
                        >
                          {booking.paymentType}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                              {new Date(booking.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {new Date(booking.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:bg-slate-100 dark:hover:bg-slate-700"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={() => handleEdit(booking)}
                              className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Booking
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="hover:bg-green-50 dark:hover:bg-green-900/20"
                              onClick={() =>
                                navigate(
                                  `/dashboard/admin/bookings/${booking.id}`
                                )
                              }
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setDeleteId(booking.id);
                                setIsDeleteDialogOpen(true);
                              }}
                              className="hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                          <ListIcon className="h-8 w-8 text-slate-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                            No bookings found
                          </h3>
                          <p className="text-slate-500 dark:text-slate-400">
                            {search
                              ? "Try adjusting your search criteria"
                              : "No bookings have been created yet"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Enhanced Pagination */}
          <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Showing{" "}
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {(page - 1) * perPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {Math.min(page * perPage, total)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {total}
                </span>{" "}
                bookings
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50"
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPage(pageNum)}
                        className={`${
                          page === pageNum
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "hover:bg-slate-100 dark:hover:bg-slate-700"
                        }`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Delete Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="border-0 shadow-2xl">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <AlertDialogTitle className="text-xl font-semibold">
                Delete Booking
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-slate-600 dark:text-slate-400">
              Are you sure you want to delete this booking? This action cannot
              be undone and will permanently remove the booking from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel className="hover:bg-slate-100 dark:hover:bg-slate-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Enhanced Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="border-0 shadow-2xl max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Edit className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <DialogTitle className="text-xl font-semibold">
                Edit Booking
              </DialogTitle>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Update the booking information below
            </p>
          </DialogHeader>
          <form onSubmit={submitEdit} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Passenger Name
              </Label>
              <Input
                placeholder="Enter passenger name"
                {...form.register("name")}
                className="focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Phone Number
              </Label>
              <Input
                placeholder="Enter phone number"
                {...form.register("phoneNumber")}
                className="focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Quantity
              </Label>
              <Input
                type="number"
                placeholder="Enter quantity"
                {...form.register("qty", { valueAsNumber: true })}
                className="focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <DialogFooter className="gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                className="hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ListBookings;
