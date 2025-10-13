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
  CreditCard,
  DollarSign,
  CheckSquare,
  ListIcon,
} from "lucide-react";

import type { Booking } from "@/redux/types/booking";
import { listBookingsFn } from "@/redux/slices/bookings/listBookings";
import { Label } from "@/components/ui/label";
import ListHotelsSkeleton from "../../components/skeletons/hotelsSkeleton";

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
    <div className="w-screen lg:w-full p-6 space-y-6">
      <h1 className="text-3xl font-bold">Bookings Management</h1>

      {/* --- Stats Cards --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-md dark:bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Bookings
            </CardTitle>
            <ListIcon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{total}</p>
            <p className="text-xs text-muted-foreground">
              All registered bookings
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md dark:bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {totalAmount.toLocaleString()} USD
            </p>
            <p className="text-xs text-muted-foreground">Sum of all payments</p>
          </CardContent>
        </Card>

        <Card className="shadow-md dark:bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Paid Bookings</CardTitle>
            <CheckSquare className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{paidCount}</p>
            <p className="text-xs text-muted-foreground">Successfully paid</p>
          </CardContent>
        </Card>

        <Card className="shadow-md dark:bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Payments
            </CardTitle>
            <CreditCard className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{pendingCount}</p>
            <p className="text-xs text-muted-foreground">
              Awaiting confirmation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* --- Actions --- */}
      <div className="flex flex-col sm:flex-row sm:justify-between mb-4 gap-2 px-4 py-4 shadow-sm dark:bg-slate-900 dark:border rounded-md">
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="destructive"
            size="sm"
            disabled={selectedIds.length === 0}
            onClick={deleteSelected}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete {selectedIds.length > 0 && `(${selectedIds.length})`}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRefreshTrigger((prev) => prev + 1)}
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
          </Button>
        </div>
        <Input
          placeholder="Search bookings..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:w-64 mt-2 sm:mt-0"
        />
      </div>

      {/* --- Table --- */}
      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox
                    checked={
                      bookings.length > 0 &&
                      bookings.every((b) => selectedIds.includes(b.id))
                    }
                    onCheckedChange={selectAll}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(booking.id)}
                        onCheckedChange={() => toggleSelect(booking.id)}
                      />
                    </TableCell>
                    <TableCell>{booking.name}</TableCell>
                    <TableCell>{booking.phoneNumber}</TableCell>
                    <TableCell>
                      {booking.ride?.route?.from} → {booking.ride?.route?.end}
                    </TableCell>
                    <TableCell>{booking.qty}</TableCell>
                    <TableCell>
                      {booking.total_amount} {booking.currency}
                    </TableCell>
                    <TableCell>{booking.paymentType}</TableCell>
                    <TableCell>
                      {new Date(booking.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleEdit(booking)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setDeleteId(booking.id);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-4">
                    No bookings found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex justify-end items-center space-x-2 mt-4">
            <Button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <span className="px-2">
              Page {page} of {totalPages}
            </span>
            <Button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* --- Delete Dialog --- */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* --- Edit Dialog --- */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Booking</DialogTitle>
          </DialogHeader>
          <form onSubmit={submitEdit} className="space-y-4">
            <Label>Name</Label>
            <Input placeholder="Name" {...form.register("name")} />
            <Label>Phone</Label>
            <Input placeholder="Phone" {...form.register("phoneNumber")} />
            <Label>Quantity</Label>
            <Input
              type="number"
              placeholder="Quantity"
              {...form.register("qty", { valueAsNumber: true })}
            />
            <DialogFooter>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ListBookings;
