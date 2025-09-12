import React, { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import type { AppDispatch, RootState } from "@/redux/store";
import {
  updateVehiclesFn,
  resetUpdateUpdateState,
} from "@/redux/slices/vehicles/updateVehicle";
import { BASE_API_URL } from "@/constants/base_url";

interface EditVehiclesProps {
  selectedVehicle: {
    id: string;
    vehicleNo: string;
    name: string;
    driverId?: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const vehicleTypes = ["Hiace", "Noah", "Bus", "Taxi"];

interface Driver {
  id: string;
  name: string;
}

const EditVehicles: React.FC<EditVehiclesProps> = ({
  selectedVehicle,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const updateState = useSelector(
    (state: RootState) => state.updateVehicleSlice
  );

  const [vehicleNo, setVehicleNo] = useState("");
  const [type, setType] = useState(vehicleTypes[0]);
  const [driverId, setDriverId] = useState<string | null>(null);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [errors, setErrors] = useState<{ vehicleNo?: string }>({});

  // Fetch drivers once
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const res = await fetch(`${BASE_API_URL}/users/all`);
        const data = await res.json();
        setDrivers(data.users.filter((u: any) => u.role === "DRIVER"));
      } catch (err) {
        console.error("Failed to fetch drivers:", err);
      }
    };
    fetchDrivers();
  }, []);

  // Initialize form when modal opens or selectedVehicle changes
  useEffect(() => {
    if (isOpen && selectedVehicle) {
      setVehicleNo(selectedVehicle.vehicleNo || "");
      setType(selectedVehicle.name || vehicleTypes[0]);
      setDriverId(selectedVehicle.driverId || null);
    } else {
      // Reset form when modal closes
      setVehicleNo("");
      setType(vehicleTypes[0]);
      setDriverId(null);
      setErrors({});
    }
  }, [isOpen, selectedVehicle]);

  // Handle Redux feedback
  useEffect(() => {
    if (updateState.error) {
      toast.error(updateState.error, { id: "updateVehicle" });
      dispatch(resetUpdateUpdateState());
    }
    if (updateState.data.isSuccess) {
      toast.success("Vehicle updated successfully!", { id: "updateVehicle" });
      dispatch(resetUpdateUpdateState());
      onSuccess();
      onClose();
    }
  }, [updateState, dispatch, onClose, onSuccess]);

  if (!isOpen || !selectedVehicle) return null;

  const validateForm = () => {
    const newErrors: { vehicleNo?: string } = {};
    if (!vehicleNo.trim()) newErrors.vehicleNo = "Vehicle number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    dispatch(
      updateVehiclesFn({
        id: selectedVehicle.id,
        vehicleNo: vehicleNo.trim(),
        name: type,
        driverId: driverId || undefined,
      })
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-800 p-6 rounded-md w-full max-w-md shadow-lg"
      >
        <h2 className="text-xl font-bold mb-4">Edit Vehicle</h2>
        <div className="flex flex-col gap-3">
          <Label htmlFor="vehicleNo">Vehicle No</Label>
          <Input
            id="vehicleNo"
            value={vehicleNo}
            onChange={(e) => setVehicleNo(e.target.value)}
            className={errors.vehicleNo ? "border-red-500" : ""}
            placeholder="Enter vehicle number"
          />
          {errors.vehicleNo && (
            <p className="text-red-500 text-sm">{errors.vehicleNo}</p>
          )}

          <Label htmlFor="vehicleType">Vehicle Type</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger id="vehicleType">
              <SelectValue placeholder="Select vehicle type" />
            </SelectTrigger>
            <SelectContent>
              {vehicleTypes.map((vType) => (
                <SelectItem key={vType} value={vType}>
                  {vType}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label htmlFor="driver">Assign Driver</Label>
          <Select
            value={driverId || "unassigned"}
            onValueChange={(value) =>
              setDriverId(value === "unassigned" ? null : value)
            }
          >
            <SelectTrigger id="driver">
              <SelectValue
                placeholder={
                  driverId
                    ? drivers.find((d) => d.id === driverId)?.name
                    : "Unassigned"
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {drivers.map((driver) => (
                <SelectItem key={driver.id} value={driver.id}>
                  {driver.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={updateState.loading}
            className={updateState.loading ? "bg-gray-600 text-white" : ""}
          >
            {updateState.loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditVehicles;
