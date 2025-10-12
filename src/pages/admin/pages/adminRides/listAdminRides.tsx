"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import {
  MoreHorizontal,
  Trash2,
  Edit,
  RefreshCw,
  Save,
  XCircle,
  Route,
  DollarSign,
  Car,
  TrendingUp,
} from "lucide-react";

import type { Ride } from "@/redux/types/rides";
import { listRidesFn } from "@/redux/slices/rides/listRidesSlice";
import ListHotelsSkeleton from "../../components/skeletons/hotelsSkeleton";
import CreateRides from "./createRides";
import { listRoutesFn } from "@/redux/slices/routes/listRoutes";

const ListAdminRides = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.listRidesSlice
  );

  const rides: Ride[] = data?.rides || [];
  const totalPages = data?.totalPages || 1;

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editRide, setEditRide] = useState<Ride | null>(null);
  const [deleteRide, setDeleteRide] = useState<Ride | null>(null);
  const perPage = 10;

  useEffect(() => {
    dispatch(listRidesFn({ page, perPage }));
  }, [dispatch, page, perPage]);

  useEffect(() => {
    dispatch(listRoutesFn({ page: 1, perPage: 100 }));
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.dismiss();
      toast.error(error);
    }
  }, [error]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    const pageIds = rides.map((r) => r.id);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));
    setSelectedIds((prev) =>
      allSelected
        ? prev.filter((id) => !pageIds.includes(id))
        : [...new Set([...prev, ...pageIds])]
    );
  };

  const handleBulkDelete = () => {
    toast.success(`Deleted ${selectedIds.length} rides`);
    setSelectedIds([]);
  };

  const handleSaveEdit = () => {
    if (editRide) {
      toast.success(`Updated ride ${editRide.id}`);
      setEditRide(null);
    }
  };

  const handleConfirmDelete = () => {
    if (deleteRide) {
      toast.success(`Deleted ride ${deleteRide.id}`);
      setDeleteRide(null);
    }
  };

  if (loading) return <ListHotelsSkeleton />;

  // --- Simple Stats Logic ---
  const totalRides = rides.length;
  const totalFareUSD = rides.reduce((sum, r) => sum + (r.fareUSD || 0), 0);
  const totalFareSLSH = rides.reduce((sum, r) => sum + (r.fareSLSH || 0), 0);
  const avgFareUSD = totalRides > 0 ? totalFareUSD / totalRides : 0;

  return (
    <div className="w-screen lg:w-full p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-2">Admin Rides Dashboard</h1>
      <p className="text-muted-foreground mb-6">
        Manage all registered rides, fares, and routes efficiently.
      </p>

      {/* --- Stats Cards --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-400">
              Total Rides
            </CardTitle>
            <Car className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRides}</div>
            <p className="text-xs text-muted-foreground">All active rides</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500/10 to-green-600/10 border-green-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-400">
              Total Fare (USD)
            </CardTitle>
            <DollarSign className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalFareUSD.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Total ride fares</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-400">
              Total Fare (SLSH)
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalFareSLSH.toLocaleString()} SLSH
            </div>
            <p className="text-xs text-muted-foreground">
              Converted local total
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-amber-500/10 to-amber-600/10 border-amber-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-400">
              Average Fare (USD)
            </CardTitle>
            <Route className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgFareUSD.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Per ride average</p>
          </CardContent>
        </Card>
      </div>

      {/* --- Actions --- */}
      <div className="flex flex-col sm:flex-row sm:justify-between mb-4 gap-2 px-4 py-4 shadow-sm dark:bg-slate-900 dark:border rounded-md">
        <div className="flex gap-2 flex-wrap">
          <CreateRides />
          <Button
            variant="destructive"
            size="sm"
            disabled={selectedIds.length === 0}
            onClick={handleBulkDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete {selectedIds.length > 0 && `(${selectedIds.length})`}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => dispatch(listRidesFn({ page, perPage }))}
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
          </Button>
        </div>
        <Input
          placeholder="Search rides..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:w-64 mt-2 sm:mt-0"
        />
      </div>

      {/* --- Table --- */}
      <Card>
        <CardHeader>
          <CardTitle>All Rides</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox
                    checked={
                      rides.length > 0 &&
                      rides.every((r) => selectedIds.includes(r.id))
                    }
                    onCheckedChange={selectAll}
                  />
                </TableHead>
                <TableHead>Creator</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Fare (USD)</TableHead>
                <TableHead>Fare (SLSH)</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rides.length > 0 ? (
                rides
                  .filter(
                    (r) =>
                      r.user?.name
                        ?.toLowerCase()
                        .includes(search.toLowerCase()) ||
                      r.route?.from
                        ?.toLowerCase()
                        .includes(search.toLowerCase()) ||
                      r.route?.end?.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((ride) => (
                    <TableRow key={ride.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(ride.id)}
                          onCheckedChange={() => toggleSelect(ride.id)}
                        />
                      </TableCell>
                      <TableCell>{ride.user?.name}</TableCell>
                      <TableCell>
                        {ride.route?.from} → {ride.route?.end}
                      </TableCell>
                      <TableCell>${ride.fareUSD.toLocaleString()}</TableCell>
                      <TableCell>
                        {ride.fareSLSH.toLocaleString()} SLSH
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => setEditRide(ride)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => setDeleteRide(ride)}
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
                  <TableCell colSpan={6} className="text-center py-4">
                    No rides found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* --- Pagination --- */}
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

      {/* --- Edit Dialog --- */}
      <Dialog open={!!editRide} onOpenChange={() => setEditRide(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Ride</DialogTitle>
          </DialogHeader>
          {editRide && (
            <div className="space-y-4">
              <div>
                <Label>Fare (USD)</Label>
                <Input
                  type="number"
                  value={editRide.fareUSD}
                  onChange={(e) =>
                    setEditRide({ ...editRide, fareUSD: +e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Fare (SLSH)</Label>
                <Input
                  type="number"
                  value={editRide.fareSLSH}
                  onChange={(e) =>
                    setEditRide({ ...editRide, fareSLSH: +e.target.value })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditRide(null)}>
              <XCircle className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              <Save className="mr-2 h-4 w-4" /> Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- Delete Confirmation --- */}
      <Dialog open={!!deleteRide} onOpenChange={() => setDeleteRide(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Ride</DialogTitle>
          </DialogHeader>
          {deleteRide && (
            <p>
              Are you sure you want to delete the ride from{" "}
              <b>{deleteRide.route?.from}</b> to <b>{deleteRide.route?.end}</b>?
            </p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteRide(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ListAdminRides;
