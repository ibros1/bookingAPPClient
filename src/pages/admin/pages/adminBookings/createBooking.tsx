"use client";

import type { AppDispatch, RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  createBookingsFn,
  resetCreateBookingstate,
} from "@/redux/slices/bookings/createBooking";
import { listRidesFn } from "@/redux/slices/rides/listRidesSlice";
import type { iCreatedBookingPayload } from "@/redux/types/booking";
import { useNavigate } from "react-router-dom";

const CreateBooking: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, data } = useSelector(
    (state: RootState) => state.createBookingsSlice
  );
  const ridesState = useSelector((state: RootState) => state.listRidesSlice);

  // ✅ load rides on mount
  useEffect(() => {
    dispatch(listRidesFn({ page: 1, perPage: 100 }));
  }, [dispatch]);

  const loginState = useSelector((state: RootState) => state.loginSlice);
  const [form, setForm] = useState<iCreatedBookingPayload>({
    amount: 0,
    bookerId: loginState.data?.user.id,
    currency: "USD",
    name: "",
    phoneNumber: "",
    paymentType: "Zaad",
    qty: 1,
    rideId: "",
    total_amount: 0,
  });

  // recalc total when qty or amount changes
  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      total_amount: prev.amount * prev.qty,
    }));
  }, [form.amount, form.qty]);

  // handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "qty" ? Number(value) : value,
    }));
  };

  // handle currency change
  const handleCurrencyChange = (value: string) => {
    setForm((prev) => ({ ...prev, currency: value }));

    // update fare based on new currency if ride is selected
    const selectedRide = ridesState.data?.rides?.find(
      (ride) => ride.id === form.rideId
    );
    if (selectedRide) {
      setForm((prev) => ({
        ...prev,
        amount: value === "USD" ? selectedRide.fareUSD : selectedRide.fareSLSH,
      }));
    }
  };

  // handle payment method change
  const handlePaymentChange = (value: string) => {
    setForm((prev) => ({ ...prev, paymentType: value }));
  };

  // handle ride selection → auto set fare
  const handleRideChange = (value: string) => {
    const selectedRide = ridesState.data?.rides?.find(
      (ride) => ride.id === value
    );

    if (selectedRide) {
      setForm((prev) => ({
        ...prev,
        rideId: value,
        amount:
          prev.currency === "USD"
            ? selectedRide.fareUSD
            : selectedRide.fareSLSH,
      }));
    } else {
      setForm((prev) => ({ ...prev, rideId: value, amount: 0 }));
    }
  };

  const createBookingsState = useSelector(
    (state: RootState) => state.createBookingsSlice
  );

  useEffect(() => {
    if (createBookingsState.error) {
      toast.dismiss();
      toast.error(createBookingsState.error);
      return;
    }
    if (createBookingsState.loading) {
      toast.dismiss();
      toast.loading("Creating Booking...");
      return;
    }

    if (createBookingsState.data?.isSuccess) {
      toast.dismiss();
      toast.success("Booking created successfully!");
      dispatch(resetCreateBookingstate());

      // Reset form
      setForm({
        amount: 0,
        bookerId: loginState.data?.user.id,
        currency: "USD",
        name: "",
        phoneNumber: "",
        paymentType: "Zaad",
        qty: 1,
        rideId: "",
        total_amount: 0,
      });

      // Role-based redirection
      const userRole = loginState.data?.user?.role;
      if (userRole === "BOOKER") {
        navigate("/dashboard/admin/booker/my-bookings");
      } else if (userRole === "ADMIN" || userRole === "OFFICER") {
        navigate("/dashboard/admin/bookings");
      } else {
        // Fallback to all bookings if role is not recognized
        navigate("/dashboard/admin/bookings");
      }
    }
  }, [
    createBookingsState.data,
    createBookingsState.loading,
    createBookingsState.error,
    navigate,
    dispatch,
    loginState.data?.user?.role,
    loginState.data?.user?.id,
  ]);

  // submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phoneNumber || !form.rideId) {
      toast.error("Please fill all required fields!");
      return;
    }

    try {
      const resultAction = await dispatch(createBookingsFn(form));
      if (createBookingsFn.fulfilled.match(resultAction)) {
        // The useEffect will handle the redirection and form reset
        // No need to duplicate the logic here
      } else {
        toast.error(
          (resultAction.payload as string) || "Failed to create booking"
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="w-full mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Booking Confirmation</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Currency */}
            <div>
              <Label className="font-semibold mb-2 block">Currency</Label>
              <RadioGroup
                value={form.currency}
                onValueChange={handleCurrencyChange}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2 border rounded-md px-4 py-2">
                  <RadioGroupItem value="USD" id="usd" />
                  <Label htmlFor="usd">Dollar (USD)</Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-md px-4 py-2">
                  <RadioGroupItem value="SLSH" id="slsh" />
                  <Label htmlFor="slsh">Shilling (SLSH)</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Payment Method */}
            <div>
              <Label className="font-semibold mb-2 block">Payment Method</Label>
              <RadioGroup
                value={form.paymentType}
                onValueChange={handlePaymentChange}
                className="flex gap-4 flex-wrap"
              >
                <div className="flex items-center space-x-2 border rounded-md px-4 py-2">
                  <RadioGroupItem value="ZAAD" id="ZAAD" />
                  <Label htmlFor="ZAAD">Zaad</Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-md px-4 py-2">
                  <RadioGroupItem value="eDAHAB" id="eDAHAB" />
                  <Label htmlFor="eDAHAB">E-Dahab</Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-md px-4 py-2">
                  <RadioGroupItem value="Wallet" id="wallet" />
                  <Label htmlFor="wallet">Wallet</Label>
                </div>
              </RadioGroup>
            </div>

            {/* User Information */}
            <div>
              <Label className="font-semibold mb-2 block">
                User Information
              </Label>
              <div className="space-y-3">
                <Input
                  placeholder="Full Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
                <Input
                  placeholder="Phone Number"
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Ride */}
            <div>
              <Label className="font-semibold mb-2 block">Select Ride</Label>
              <Select value={form.rideId} onValueChange={handleRideChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a ride" />
                </SelectTrigger>
                <SelectContent>
                  {ridesState.data?.rides?.map((ride) => (
                    <SelectItem key={ride.id} value={ride.id}>
                      {ride.route?.from} → {ride.route?.end} (
                      {form.currency === "USD" ? ride.fareUSD : ride.fareSLSH}{" "}
                      {form.currency})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quantity */}
            <div>
              <Label htmlFor="qty">Quantity</Label>
              <Input
                id="qty"
                name="qty"
                type="number"
                min={1}
                value={form.qty || ""} // ✅ keep empty string if cleared
                onChange={handleChange}
                required
              />
            </div>

            {/* Total */}
            <div className="flex justify-between items-center bg-gray-100 dark:bg-slate-800 px-4 py-3 rounded-md">
              <span className="font-semibold">Per Price</span>

              <span className="text-lg font-bold">
                {form.currency === "USD"
                  ? `$${form.amount.toLocaleString()}`
                  : `SHL ${form.amount.toLocaleString()}`}
              </span>
            </div>
            <div className="flex justify-between items-center bg-gray-100 dark:bg-slate-800 px-4 py-3 rounded-md">
              <span className="font-semibold">Total Price</span>

              <span className="text-lg font-bold">
                {form.currency === "USD"
                  ? `$${form.total_amount.toLocaleString()}`
                  : `SHL ${form.total_amount.toLocaleString()}`}
              </span>
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Processing..." : "Confirm & Pay"}
            </Button>
          </form>

          {/* Feedback */}
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {data?.booking && (
            <p className="text-green-500 mt-2">Booking ID: {data.booking.id}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateBooking;
