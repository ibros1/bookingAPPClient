import React, { useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
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
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { createBookingsFn } from "@/redux/slices/bookings/createBookings";
import { toast } from "sonner"; // ✅ using sonner toast (already included in shadcn stack)

const paymentSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(6, "Phone is required"),
  currency: z.enum(["USD", "SLSH"]),
  paymentType: z.enum(["eDAHAB", "ZAAD"]),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

interface PayPopupProps {
  seatId: string[];
  scheduleRideId: string;
  userId: string;
  onClose: () => void;
}

const PayPopup: React.FC<PayPopupProps> = ({
  seatId,
  scheduleRideId,
  userId,
  onClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const ride = useSelector(
    (state: RootState) => state.getOneRidesSlice.data?.ride
  );

  const bookingState = useSelector(
    (state: RootState) => state.createBookingsSlice
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      currency: "USD",
      paymentType: "eDAHAB",
      name: "",
      phone: "",
    },
  });

  const selectedCurrency = watch("currency");
  const selectedPaymentType = watch("paymentType");

  const routeFrom = ride?.route?.from || "Unknown";
  const routeTo = ride?.route?.end || "Unknown";
  const fareUSD = Number(ride?.fareUSD) || 0;
  const fareSLSH = Number(ride?.fareSLSH) || 0;

  const allSeats = ride?.seats || [];
  const selectedSeatNumbers = allSeats
    .filter((s: any) => seatId.includes(s.id))
    .map((s: any) => s.seatNumber);

  const totalAmount = useMemo(() => {
    const fare = selectedCurrency === "USD" ? fareUSD : fareSLSH;
    return isNaN(fare) ? 0 : fare * seatId.length;
  }, [selectedCurrency, fareUSD, fareSLSH, seatId.length]);

  // ✅ handle side effects for success/error toast
  useEffect(() => {
    if (bookingState.data.isSuccess) {
      toast.success("Booking confirmed successfully!");
      onClose();
    } else if (bookingState.error) {
      toast.error(bookingState.error || "Failed to create booking.");
    }
  }, [bookingState.data.isSuccess, bookingState.error, onClose]);

  const submitHandler = (data: PaymentFormValues) => {
    const payload = {
      userId,
      scheduleRideId,
      seatIds: seatId,
      name: data.name,
      phoneNumber: data.phone,
      amount: totalAmount / seatId.length,
      qty: seatId.length,
      paymentType: data.paymentType,
      currency: data.currency,
      paymentStatus: "PAID",
    };
    dispatch(createBookingsFn(payload));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-[430px] max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white text-center py-4 flex-shrink-0">
          <h2 className="text-xl font-semibold">Booking Confirmation</h2>
          <p className="text-sm text-blue-100">
            Please review and confirm your booking details
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Booking Summary */}
          <div className="bg-gray-50 p-4 rounded-xl border space-y-2 text-sm">
            <p>
              <strong>Route:</strong> {routeFrom} → {routeTo}
            </p>
            <p>
              <strong>Fare per seat:</strong>{" "}
              {(
                (selectedCurrency === "USD" ? fareUSD : fareSLSH) || 0
              ).toLocaleString()}{" "}
              {selectedCurrency}
            </p>
            <p>
              <strong>Selected Seats:</strong>{" "}
              {selectedSeatNumbers.join(", ") || "None"}
            </p>
            <p className="font-semibold text-gray-900 text-base border-t pt-2 mt-2">
              Total: {totalAmount.toLocaleString()} {selectedCurrency}
            </p>
          </div>

          {/* Selected Seats */}
          <div>
            <Label className="block mb-2 font-medium">Seats</Label>
            <div className="flex flex-wrap gap-2">
              {selectedSeatNumbers.map((seat) => (
                <div
                  key={seat}
                  className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-800 font-medium shadow-sm border border-blue-200 text-sm"
                >
                  Seat {seat}
                </div>
              ))}
            </div>
          </div>

          {/* Payment Type */}
          <div>
            <Label className="block mb-2 font-medium">Payment Type</Label>
            <div className="flex space-x-3">
              {["eDAHAB", "ZAAD"].map((type) => (
                <Button
                  key={type}
                  type="button"
                  variant={selectedPaymentType === type ? "default" : "outline"}
                  onClick={() =>
                    setValue("paymentType", type as "eDAHAB" | "ZAAD")
                  }
                  className="flex-1"
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter full name"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="Enter phone number"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <Label>Currency</Label>
              <Select
                value={selectedCurrency}
                onValueChange={(value) =>
                  setValue("currency", value as "USD" | "SLSH")
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="SLSH">SLSH</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600"
                disabled={bookingState.loading}
              >
                {bookingState.loading ? "Processing..." : "Confirm & Pay"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PayPopup;
