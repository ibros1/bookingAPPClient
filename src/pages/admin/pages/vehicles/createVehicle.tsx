import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import {
  createVehicleFn,
  resetCreateVehicleRedu,
} from "@/redux/slices/vehicles/vehicle";
import { BASE_API_URL } from "@/constants/base_url";
import type { Drivers } from "@/redux/types/vehicle";
import { useNavigate } from "react-router-dom";
import { refreshState } from "@/redux/slices/vehicles/listVehicles";

interface VehicleType {
  HIACE: string;
  NOAH: string;
  BUS: string;
  TAXI: string;
}

// Define the actual vehicle types
const vehicleTypes: VehicleType = {
  HIACE: "Hiace",
  NOAH: "Noah",
  BUS: "Bus",
  TAXI: "Taxi",
};

const CreateVehicle = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const createVehicleState = useSelector(
    (state: RootState) => state.createVehicleSlice
  );

  const [vehicleNo, setVehicleNo] = useState("");
  const [vehicleType, setVehicleType] = useState<string>("");
  const [driverId, setDriverId] = useState("");
  const [drivers, setDrivers] = useState<Drivers[]>([]);

  // Fetch drivers
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const res = await fetch(`${BASE_API_URL}/users/all`);
        const data = await res.json();
        const driverUsers = data.users.filter(
          (user: any) => user.role === "DRIVER"
        );
        setDrivers(driverUsers);
      } catch (err) {
        console.error("Failed to fetch drivers:", err);
      }
    };

    fetchDrivers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleNo || !vehicleType || !driverId) {
      toast.error("Please fill all required fields.");
      return;
    }

    dispatch(createVehicleFn({ vehicleNo, name: vehicleType, driverId }))
      .unwrap()
      .then((res) => {
        toast.success(res.message || "Vehicle created successfully!");
        setVehicleNo("");
        setVehicleType("");
        setDriverId("");
        navigate("/dashboard/admin/vehicles");
        dispatch(refreshState(createVehicleState.data.vehicle));
        dispatch(resetCreateVehicleRedu());
      })
      .catch((err: string) => toast.error(err));
  };

  return (
    <div className="p-6">
      <Card className="mx-auto ">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Create New Vehicle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Vehicle Number */}
            <div className="space-y-1">
              <Label htmlFor="vehicleNo">Vehicle Number</Label>
              <Input
                id="vehicleNo"
                placeholder="Enter vehicle number"
                value={vehicleNo}
                onChange={(e) => setVehicleNo(e.target.value)}
              />
            </div>

            {/* Vehicle Type */}
            <div className="space-y-1">
              <Label htmlFor="vehicleType">Vehicle Type</Label>
              <Select onValueChange={setVehicleType} value={vehicleType}>
                <SelectTrigger id="vehicleType">
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(vehicleTypes).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Driver */}
            <div className="space-y-1">
              <Label htmlFor="driverId">Assign Driver</Label>
              <Select onValueChange={setDriverId} value={driverId}>
                <SelectTrigger id="driverId">
                  <SelectValue placeholder="Select a driver" />
                </SelectTrigger>
                <SelectContent>
                  {drivers.map((driver) => (
                    <SelectItem key={driver.id} value={driver.id}>
                      {driver.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              disabled={createVehicleState.loading}
            >
              {createVehicleState.loading ? "Creating..." : "Create Vehicle"}
            </Button>

            {createVehicleState.error && (
              <p className="text-red-500 mt-2">{createVehicleState.error}</p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateVehicle;
