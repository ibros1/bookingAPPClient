"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { listVehiclesFn } from "@/redux/slices/vehicles/listVehicles";
import {
  updateVehiclesFn,
  resetUpdateUpdateState,
} from "@/redux/slices/vehicles/updateVehicle";
import type { AppDispatch, RootState } from "@/redux/store";
import { BASE_API_URL } from "@/constants/base_url";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Edit,
  Eye,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

import VehicleSkeleton from "../../components/skeletons/vehicleSkeleton";
import { Label } from "@/components/ui/label";
import type {
  Drivers,
  iUpdatedVehiclePayload,
  Vehicle,
} from "@/redux/types/vehicle";
import { useNavigate } from "react-router-dom";

const vehicleTypes = ["Hiace", "Noah", "Bus", "Taxi"];

const VehicleManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading } = useSelector(
    (state: RootState) => state.listVehiclesSlice
  );
  const updateState = useSelector(
    (state: RootState) => state.updateVehicleSlice
  );

  const [page, setPage] = useState(1);
  const perPage = 10;
  const [search, setSearch] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof Vehicle>("vehicleNo");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [drivers, setDrivers] = useState<Drivers[]>([]);

  const navigate = useNavigate();

  // --- React Hook Form ---
  const { handleSubmit, control, reset } = useForm<{
    vehicleNo: string;
    type: string;
    driverId: string;
  }>({
    defaultValues: {
      vehicleNo: "",
      type: vehicleTypes[0],
      driverId: "",
    },
  });

  // --- Fetch vehicles ---
  useEffect(() => {
    dispatch(listVehiclesFn({ page }));
  }, [dispatch, page, refreshTrigger]);

  // --- Fetch drivers ---
  useEffect(() => {
    const controller = new AbortController();
    const fetchDrivers = async () => {
      try {
        const res = await fetch(`${BASE_API_URL}/users/all`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Failed to fetch drivers");
        const json = await res.json();
        const driverList: Drivers[] = (json.users || []).filter(
          (u: any) => u.role === "DRIVER"
        );
        setDrivers(driverList);
      } catch (err) {
        if ((err as any).name === "AbortError") return;
        console.error(err);
      }
    };
    fetchDrivers();
    return () => controller.abort();
  }, []);

  // --- Populate form when editing ---
  useEffect(() => {
    if (editingVehicle) {
      reset({
        vehicleNo: editingVehicle.vehicleNo,
        type: editingVehicle.name,
        driverId: editingVehicle.driverId ?? "",
      });
    }
  }, [editingVehicle, reset]);

  // --- Update notifications ---
  useEffect(() => {
    if (updateState?.error) {
      toast.error(updateState.error, { id: "updateVehicle" });
      dispatch(resetUpdateUpdateState());
    }
    if (updateState?.data?.isSuccess) {
      toast.success("Vehicle updated successfully!", { id: "updateVehicle" });
      dispatch(resetUpdateUpdateState());
      setEditingVehicle(null);
      setRefreshTrigger((prev) => prev + 1);
    }
  }, [updateState, dispatch]);

  if (loading) return <VehicleSkeleton />;

  const vehicles: Vehicle[] = data?.vehicles || [];

  // --- Filter & sort ---
  const filteredVehicles = vehicles.filter((v) =>
    [v.vehicleNo, v.name, v.drivers?.name, v.drivers?.email].some((field) =>
      field?.toLowerCase().includes(search.toLowerCase())
    )
  );

  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    const aValue = a[sortColumn] ?? "";
    const bValue = b[sortColumn] ?? "";
    if (typeof aValue === "string" && typeof bValue === "string")
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    if (typeof aValue === "number" && typeof bValue === "number")
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    return 0;
  });

  const startIndex = (page - 1) * perPage;
  const paginatedVehicles = sortedVehicles.slice(
    startIndex,
    startIndex + perPage
  );
  const totalVehicles = data?.total || vehicles.length;
  const totalPages = Math.max(1, Math.ceil(totalVehicles / perPage));

  // --- Selection ---
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    const pageIds = paginatedVehicles.map((v) => v.id);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));
    if (allSelected)
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    else setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
  };

  const deleteSelected = () => {
    console.log("Deleting IDs:", selectedIds);
    setSelectedIds([]);
    setRefreshTrigger((prev) => prev + 1);
  };

  // --- Form submission ---
  const onSubmit = (values: {
    vehicleNo: string;
    type: string;
    driverId: string;
  }) => {
    if (!editingVehicle) return;
    const payload: iUpdatedVehiclePayload = {
      id: editingVehicle.id,
      vehicleNo: values.vehicleNo.trim(),
      name: values.type,
      driverId: values.driverId || undefined,
    };
    dispatch(updateVehiclesFn(payload));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Vehicle Management</h1>

      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { title: "Total Vehicles", value: totalVehicles },
          { title: "Active Drivers", value: drivers.length || 0 },
          {
            title: "Vehicles Assigned",
            value: vehicles.filter((v) => !!v.driverId).length,
          },
        ].map((stat) => (
          <Card
            key={stat.title}
            className="shadow-sm bg-green-50 text-slate-800 dark:bg-slate-800 dark:text-white"
          >
            <CardContent>
              <CardTitle>{stat.title}</CardTitle>
              <p className="text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row sm:justify-between mb-4 gap-2 px-4 py-8 shadow-sm dark:bg-slate-900 dark:border rounded-md">
        <div className="flex gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => navigate("/dashboard/admin/vehicle/new")}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Vehicle
          </Button>
          <Button
            variant="destructive"
            size="sm"
            disabled={selectedIds.length === 0}
            onClick={deleteSelected}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete{selectedIds.length > 0 && ` (${selectedIds.length})`}
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
          placeholder="Search vehicles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:w-64"
        />
      </div>

      {/* Vehicle Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Vehicles</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox
                    checked={
                      paginatedVehicles.length > 0 &&
                      paginatedVehicles.every((v) => selectedIds.includes(v.id))
                    }
                    onCheckedChange={selectAll}
                  />
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => {
                    setSortColumn("vehicleNo");
                    setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
                  }}
                >
                  Vehicle No{" "}
                  {sortColumn === "vehicleNo" &&
                    (sortOrder === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Driver Name</TableHead>
                <TableHead>Driver Email</TableHead>
                <TableHead>Driver Phone</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedVehicles.length > 0 ? (
                paginatedVehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(vehicle.id)}
                        onCheckedChange={() => toggleSelect(vehicle.id)}
                      />
                    </TableCell>
                    <TableCell>{vehicle.vehicleNo}</TableCell>
                    <TableCell>{vehicle.name}</TableCell>
                    <TableCell>{vehicle.drivers?.name || "-"}</TableCell>
                    <TableCell>{vehicle.drivers?.email || "-"}</TableCell>
                    <TableCell>{vehicle.drivers?.phone || "-"}</TableCell>
                    <TableCell>
                      {vehicle
                        ? new Date(vehicle.updatedAt).toLocaleString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "numeric",
                          })
                        : "-"}
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
                            onClick={() => setEditingVehicle(vehicle)}
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" /> View
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    No vehicles found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span className="flex items-center px-2">
              Page {page} of {totalPages}
            </span>
            <Button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Update Modal */}
      {editingVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white dark:bg-slate-800 p-6 rounded-md w-full max-w-md shadow-lg"
          >
            <h2 className="text-xl font-bold mb-4">Edit Vehicle</h2>

            <div className="flex flex-col gap-4">
              {/* Vehicle No */}
              <div>
                <Label htmlFor="vehicleNo">Vehicle Number</Label>
                <Controller
                  name="vehicleNo"
                  control={control}
                  rules={{ required: "Vehicle number is required" }}
                  render={({ field, fieldState }) => (
                    <>
                      <Input
                        {...field}
                        placeholder="Enter vehicle number"
                        className={fieldState.error ? "border-red-500" : ""}
                      />
                      {fieldState.error && (
                        <p className="text-red-500 text-sm">
                          {fieldState.error.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>

              {/* Vehicle Type */}
              <div>
                <Label htmlFor="type">Vehicle Type</Label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select {...field}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select vehicle type" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicleTypes.map((v) => (
                          <SelectItem key={v} value={v}>
                            {v}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Driver */}
              <div>
                <Label htmlFor="driverId">Driver</Label>
                <Controller
                  name="driverId"
                  control={control}
                  render={({ field }) => (
                    <Select {...field}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select driver" />
                      </SelectTrigger>
                      <SelectContent>
                        {drivers.map((d) => (
                          <SelectItem key={d.id} value={d.id}>
                            {d.name} ({d.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingVehicle(null)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateState?.loading}>
                {updateState?.loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default VehicleManagement;
