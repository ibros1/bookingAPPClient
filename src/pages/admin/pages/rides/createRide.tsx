"use client";

import React, { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import type { AppDispatch, RootState } from "@/redux/store";
import {
  createridesFn,
  resetCreateridestate,
} from "@/redux/slices/rides/createRide";
import { listRoutesFn } from "@/redux/slices/routes/listAllRoutes";
import { listVehiclesFn } from "@/redux/slices/vehicles/listVehicles";
import { listDriversFn } from "@/redux/slices/users/access/drivers";

interface FormValues {
  routeId: string;
  vehicleId: string;
  driverId: string;
  fareUSD: number;
  fareSLSH: number;
  day: string; // friendly value, will convert to enum
  startTime: string;
  endTime: string;
}

// Helper to map "today"/"tomorrow" to backend weekday enums
const getWeekdayEnum = (day: string) => {
  if (day === "week") return "WEEK";
  const offset = day === "tomorrow" ? 1 : 0;
  return new Date(Date.now() + offset * 24 * 60 * 60 * 1000)
    .toLocaleDateString("en-US", { weekday: "long" })
    .toUpperCase();
};

const CreateRide: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Redux slices
  const { loading, error } = useSelector(
    (state: RootState) => state.createridesSlice
  );
  const routesRaw = useSelector(
    (state: RootState) => state.listRoutesSlice.data?.routes
  );
  const vehiclesRaw = useSelector(
    (state: RootState) => state.listVehiclesSlice.data?.vehicles
  );
  const driversRaw = useSelector(
    (state: RootState) => state.listDriversSlice.data?.drivers
  );

  // Memoized arrays
  const routes = useMemo(() => routesRaw || [], [routesRaw]);
  const vehicles = useMemo(() => vehiclesRaw || [], [vehiclesRaw]);
  const drivers = useMemo(() => driversRaw || [], [driversRaw]);

  // Fetch data on mount
  useEffect(() => {
    dispatch(listRoutesFn());
    dispatch(listVehiclesFn({ page: 1, perPage: 100 }));
    dispatch(listDriversFn({ page: 1, limit: 100 }));
  }, [dispatch]);

  // React Hook Form
  const { handleSubmit, control, watch, setValue, reset } = useForm<FormValues>(
    {
      defaultValues: {
        routeId: "",
        vehicleId: "",
        driverId: "",
        fareUSD: 0,
        fareSLSH: 0,
        day: "today",
        startTime: "",
        endTime: "",
      },
    }
  );

  // Auto-assign driver when vehicle changes
  const selectedVehicleId = watch("vehicleId");
  useEffect(() => {
    if (selectedVehicleId) {
      const vehicle = vehicles.find((v) => v.id === selectedVehicleId);
      setValue("driverId", vehicle?.driverId || "");
    } else {
      setValue("driverId", "");
    }
  }, [selectedVehicleId, vehicles, setValue]);

  // Submit handler
  const onSubmit = async (values: FormValues) => {
    if (!values.fareUSD || !values.fareSLSH) {
      toast.error("Both USD and Shilling fares are required!");
      return;
    }

    const payload = {
      ...values,
      day: getWeekdayEnum(values.day),
    };

    try {
      await dispatch(createridesFn(payload)).unwrap();
      toast.success("Ride created successfully!");
      reset();
      dispatch(resetCreateridestate());
    } catch (err: any) {
      toast.error(err?.message || "Failed to create ride");
    }
  };

  return (
    <div className="p-6 shadow-sm m-4 border rounded-md max-w-full  ">
      <h1 className="text-2xl font-bold mb-6">Create Ride</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Route */}
        <div>
          <Label htmlFor="routeId">Route</Label>
          <Controller
            name="routeId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a route" />
                </SelectTrigger>
                <SelectContent>
                  {routes.length > 0 ? (
                    routes.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.from} - {r.end}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled value="none">
                      No routes found
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Vehicle */}
        <div>
          <Label htmlFor="vehicleId">Vehicle</Label>
          <Controller
            name="vehicleId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.length > 0 ? (
                    vehicles.map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.name} ({v.vehicleNo})
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled value="none">
                      No vehicles found
                    </SelectItem>
                  )}
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
              <Select value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Driver assigned automatically" />
                </SelectTrigger>
                <SelectContent>
                  {drivers
                    .filter((d) => d.id === field.value)
                    .map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Fares */}
        <div>
          <Label htmlFor="fareUSD">Fare (USD)</Label>
          <Controller
            name="fareUSD"
            control={control}
            render={({ field }) => <Input type="number" {...field} />}
          />
        </div>

        <div>
          <Label htmlFor="fareSLSH">Fare (Shilling)</Label>
          <Controller
            name="fareSLSH"
            control={control}
            render={({ field }) => <Input type="number" {...field} />}
          />
        </div>

        {/* Day */}
        <div>
          <Label htmlFor="day">Ride Day</Label>
          <Controller
            name="day"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="tomorrow">Tomorrow</SelectItem>
                  <SelectItem value="week">Upcoming Week</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Start & End Time */}
        <div>
          <Label htmlFor="startTime">Start Time</Label>
          <Controller
            name="startTime"
            control={control}
            render={({ field }) => <Input type="datetime-local" {...field} />}
          />
        </div>
        <div>
          <Label htmlFor="endTime">End Time</Label>
          <Controller
            name="endTime"
            control={control}
            render={({ field }) => <Input type="datetime-local" {...field} />}
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Ride"}
        </Button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default CreateRide;
