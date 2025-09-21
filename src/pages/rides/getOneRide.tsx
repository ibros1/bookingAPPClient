import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { getOneRidesFn } from "@/redux/slices/rides/getOneRide";
import { createBookingsFn } from "@/redux/slices/bookings/createBookings";
import PayPopup from "../payments/pay";

const GetOneRide = () => {
  const { rideId } = useParams<{ rideId?: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const { data, loading, error } = useSelector(
    (state: RootState) => state.getOneRidesSlice
  );

  const bookingState = useSelector(
    (state: RootState) => state.createBookingsSlice
  );

  const user = useSelector((state: RootState) => state.loginSlice.data.user);

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [showPayPopup, setShowPayPopup] = useState(false);

  useEffect(() => {
    if (rideId) dispatch(getOneRidesFn(rideId));
  }, [dispatch, rideId]);

  const handleSeatClick = (seatId: string, isBooked: boolean) => {
    if (isBooked) return;
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((s) => s !== seatId)
        : [...prev, seatId]
    );
  };

  const handleBookingClick = () => {
    if (!selectedSeats.length) return;
    setShowPayPopup(true);
  };

  const handlePaymentConfirm = (payload: any) => {
    if (!rideId || !user?.id) return;

    selectedSeats.forEach((seat) => {
      dispatch(
        createBookingsFn({
          scheduleRideId: rideId,
          seatId: seat,
          currency: payload.currency,
          paymentType: payload.paymentType,
          paymentStatus: "PAID",
          userId: user.id,
        })
      );
    });

    setShowPayPopup(false);
    setSelectedSeats([]);
  };

  if (loading) return <p className="text-center mt-4">Loading ride...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!data?.ride)
    return <p className="text-center text-gray-500">Ride not found.</p>;

  return (
    <div className="p-4 mx-4 lg:mx-44">
      <h2 className="text-xl font-bold mb-4 text-center">
        {data.ride.vehicle?.name} {data.ride.vehicle?.vehicleNo}
      </h2>

      {/* Route Info */}
      <div className="flex justify-between items-center text-sm mb-4">
        <span className="font-medium">{data.ride.route?.from}</span>
        <span className="text-gray-400">→</span>
        <span className="font-medium">{data.ride.route?.end}</span>
      </div>

      {/* Legend */}
      <div className="flex justify-center space-x-6 mb-6">
        <span className="flex items-center text-xs">
          <span className="w-5 h-5 bg-red-400 rounded mr-1"></span>Booked
        </span>
        <span className="flex items-center text-xs">
          <span className="w-5 h-5 bg-green-400 rounded mr-1"></span>Available
        </span>
        <span className="flex items-center text-xs">
          <span className="w-5 h-5 bg-yellow-400 rounded mr-1"></span>Selected
        </span>
      </div>

      {/* Seat Layout */}
      <div className="flex justify-center">
        <div className="bg-gray-100 rounded-2xl p-6 relative shadow-md">
          <div className="flex justify-start mb-6">
            <div className="w-10 h-10 bg-black rounded-full"></div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {data.ride.seats.map((seat) => {
              const isSelected = selectedSeats.includes(seat.id);
              const color = seat.isBooked
                ? "bg-red-400"
                : isSelected
                ? "bg-yellow-400"
                : "bg-green-400";

              return (
                <div
                  key={seat.id}
                  onClick={() => handleSeatClick(seat.id, seat.isBooked)}
                  className={`w-12 h-12 rounded-lg flex items-center justify-center text-sm font-bold text-white cursor-pointer transition-transform ${
                    seat.isBooked
                      ? "cursor-not-allowed opacity-70"
                      : "hover:scale-105"
                  } ${color}`}
                >
                  {seat.seatNumber}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 flex justify-between items-center">
        <span className="text-sm text-gray-500">
          Driver: {data.ride.driver?.name || "Unknown"}
        </span>
        <span className="text-sm font-bold">
          {data.ride.totalSeats} - {data.ride.bookings.length} seats booked
        </span>
      </div>

      {/* Booking Button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleBookingClick}
          disabled={!selectedSeats.length || bookingState.loading}
          className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-bold disabled:opacity-50"
        >
          {bookingState.loading
            ? "Booking..."
            : selectedSeats.length
            ? `Book ${selectedSeats.length} seat(s)`
            : "Select a Seat"}
        </button>
      </div>

      {/* Booking Error */}
      {bookingState.error && (
        <p className="text-center text-red-500 mt-2">{bookingState.error}</p>
      )}

      {/* Payment Popup */}
      {showPayPopup && (
        <PayPopup
          seatId={selectedSeats}
          scheduleRideId={rideId!}
          userId={user.id}
          routeFrom={data.ride.route?.from || ""}
          routeTo={data.ride.route?.end || ""}
          farePerSeat={data.ride.fare}
          onClose={() => setShowPayPopup(false)}
          onConfirm={handlePaymentConfirm}
        />
      )}
    </div>
  );
};

export default GetOneRide;
