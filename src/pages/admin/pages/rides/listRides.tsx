"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import type { AppDispatch, RootState } from "@/redux/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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
  Edit,
  Eye,
  MoreHorizontal,
  Plus,
  Trash2,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";

import { listRidesFn } from "@/redux/slices/rides/listRides";
import type { Ride } from "@/redux/types/rides";
import VehicleSkeleton from "../../components/skeletons/vehicleSkeleton";

interface FormValues {
  fare: number;
}

const ListRides: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading } = useSelector(
    (state: RootState) => state.listRidesSlice
  );

  const [page, setPage] = useState(1);
  const perPage = 10;
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingRide, setEditingRide] = useState<Ride | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [takenSeatsMap, setTakenSeatsMap] = useState<Record<string, number>>(
    {}
  );

  const { handleSubmit, control, reset } = useForm<FormValues>({
    defaultValues: { fare: 0 },
  });

  // Fetch rides
  useEffect(() => {
    dispatch(listRidesFn({ page, perPage }));
  }, [dispatch, page, refreshTrigger]);

  const rides: Ride[] = data?.rides || [];

  // Fetch taken seats per ride
  useEffect(() => {
    const fetchTakenSeats = async () => {
      const map: Record<string, number> = {};
      await Promise.all(
        rides.map(async (ride) => {
          try {
            const res = await fetch(
              `http://localhost:4000/api/seats/get-by-ride?ride_id=${ride.id}`
            );
            const result = await res.json();
            const bookedCount = result.seats.filter(
              (s: any) => s.isBooked
            ).length;
            map[ride.id] = bookedCount;
          } catch (error) {
            console.error("Error fetching seats for ride:", ride.id, error);
            map[ride.id] = 0;
          }
        })
      );
      setTakenSeatsMap(map);
    };

    if (rides.length > 0) fetchTakenSeats();
  }, [rides, refreshTrigger]);

  // Filter & search
  const filteredRides = rides.filter((r) =>
    [r.driver.name, r.route.from, r.route.end].some((field) =>
      field.toLowerCase().includes(search.toLowerCase())
    )
  );

  // Pagination
  const startIndex = (page - 1) * perPage;
  const paginatedRides = filteredRides.slice(startIndex, startIndex + perPage);
  const totalPages = Math.max(1, Math.ceil(filteredRides.length / perPage));

  // Selection handlers
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    const pageIds = paginatedRides.map((r) => r.id);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));
    if (allSelected)
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    else setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
  };

  const deleteSelected = () => {
    console.log("Deleting rides:", selectedIds);
    toast.success(`Deleted ${selectedIds.length} rides (mock)`);
    setSelectedIds([]);
    setRefreshTrigger((prev) => prev + 1);
  };

  // Populate form when editing
  useEffect(() => {
    if (editingRide) {
      reset({ fare: editingRide.fare });
    }
  }, [editingRide, reset]);

  const onSubmit = (values: FormValues) => {
    if (!editingRide) return;
    toast.success(`Ride updated with fare ${values.fare} (mock)`);
    setEditingRide(null);
    setRefreshTrigger((prev) => prev + 1);
  };

  if (loading) return <VehicleSkeleton />;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Rides Management</h1>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row sm:justify-between mb-4 gap-2 px-4 py-4 shadow-sm rounded-md">
        <div className="flex gap-2">
          <Button variant="default" size="sm">
            <Plus className="mr-2 h-4 w-4" /> Add Ride
          </Button>
          <Button
            variant="destructive"
            size="sm"
            disabled={selectedIds.length === 0}
            onClick={deleteSelected}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
            {selectedIds.length > 0 && ` (${selectedIds.length})`}
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
          placeholder="Search by driver or route..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:w-64"
        />
      </div>

      {/* Table */}
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
                      paginatedRides.length > 0 &&
                      paginatedRides.every((r) => selectedIds.includes(r.id))
                    }
                    onCheckedChange={selectAll}
                  />
                </TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Fare</TableHead>
                <TableHead>Total Seats</TableHead>
                <TableHead>Taken Seats</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>End Time</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRides.length > 0 ? (
                paginatedRides.map((ride) => (
                  <TableRow key={ride.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(ride.id)}
                        onCheckedChange={() => toggleSelect(ride.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <span
                        className="cursor-pointer text-blue-600 hover:underline"
                        title={ride.id}
                        onClick={() => {
                          navigator.clipboard.writeText(ride.id);
                          toast.success("Ride ID copied to clipboard!");
                        }}
                      >
                        {ride.id.slice(0, 8)}...
                      </span>
                    </TableCell>
                    <TableCell>
                      {ride.route.from} - {ride.route.end}
                    </TableCell>
                    <TableCell>{ride.driver.name}</TableCell>
                    <TableCell>
                      {ride.vehicle.name} ({ride.vehicle.vehicleNo})
                    </TableCell>
                    <TableCell>{ride.fare}</TableCell>
                    <TableCell>{ride.totalSeats}</TableCell>
                    <TableCell>{takenSeatsMap[ride.id] || 0}</TableCell>
                    <TableCell>
                      {new Date(ride.startTime).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {new Date(ride.endTime).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => setEditingRide(ride)}
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" /> View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-4">
                    No rides found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex justify-end space-x-2 mt-4">
            <Button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <span className="flex items-center px-2">
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

      {/* Edit Ride Modal */}
      {editingRide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white dark:bg-slate-800 p-6 rounded-md w-full max-w-md shadow-lg"
          >
            <h2 className="text-xl font-bold mb-4">
              Edit Ride {editingRide.id}
            </h2>
            <div className="flex flex-col gap-4">
              <div>
                <Label htmlFor="fare">Fare</Label>
                <Controller
                  name="fare"
                  control={control}
                  render={({ field }) => <Input type="number" {...field} />}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingRide(null)}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ListRides;
