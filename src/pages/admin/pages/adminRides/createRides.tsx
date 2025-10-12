"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import type { iCreatedRidesPayload } from "@/redux/types/rides";
import {
  createRidesFn,
  resetCreateRidestate,
} from "@/redux/slices/rides/createRides";
import { listRidesFn } from "@/redux/slices/rides/listRidesSlice";

const CreateRides = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, data } = useSelector(
    (state: RootState) => state.createRidesSlice
  );
  const loginState = useSelector((state: RootState) => state.loginSlice);
  const routesState = useSelector((state: RootState) => state.listRoutesSlice);

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<iCreatedRidesPayload>({
    userId: loginState?.data?.user?.id || "",
    routeId: "",
    fareUSD: 0,
    fareSLSH: 0,
  });

  useEffect(() => {
    if (data?.isSuccess) {
      toast.dismiss();
      toast.success("Ride created successfully!");
      setOpen(false);
      setFormData({
        userId: loginState?.data?.user?.id || "",
        routeId: "",
        fareUSD: 0,
        fareSLSH: 0,
      });
      dispatch(resetCreateRidestate());
      dispatch(listRidesFn({ page: 1, perPage: 10 }));
    }
    if (loading) {
      toast.dismiss();
      toast.dismiss();
      toast.loading("Creating Ride...");
      return;
    }

    if (error) {
      toast.dismiss();
      toast.error(error);
      return;
    }
  }, [data, error, loginState, dispatch, loading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["fareUSD", "fareSLSH"].includes(name) ? Number(value) : value,
    }));
  };

  const handleRouteChange = (value: string) => {
    setFormData((prev) => ({ ...prev, routeId: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createRidesFn(formData));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">+ Create Ride</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create a New Ride</DialogTitle>
          <DialogDescription>
            Fill in the form below to create a new ride.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User */}
          <div>
            <Label>User</Label>
            <Input value={loginState?.data?.user?.name || ""} disabled />
          </div>

          {/* Route */}
          <div>
            <Label htmlFor="routeId">Select Route</Label>
            <Select onValueChange={handleRouteChange} value={formData.routeId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a route" />
              </SelectTrigger>
              <SelectContent>
                {routesState.data?.routes?.map((route) => (
                  <SelectItem key={route.id} value={route.id}>
                    {route.from} → {route.end}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Fares */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fareUSD">Fare (USD)</Label>
              <Input
                id="fareUSD"
                name="fareUSD"
                type="number"
                value={formData.fareUSD}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="fareSLSH">Fare (SLSH)</Label>
              <Input
                id="fareSLSH"
                name="fareSLSH"
                type="number"
                value={formData.fareSLSH}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-2">
            <Button
              className=""
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="disabled:cursor-not-allowed disabled:bg-gray-500"
              disabled={loading}
              type="submit"
            >
              {loading ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRides;
