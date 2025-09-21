import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import type { AppDispatch, RootState } from "@/redux/store";
import { getRidesByRouteFn } from "@/redux/slices/rides/getRidesByRoute";

const GetRidesByRoute = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { routeId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const date =
    searchParams.get("date") || new Date().toISOString().slice(0, 10);

  const { data, loading, error } = useSelector(
    (state: RootState) => state.getRidesByRouteSlice
  );

  useEffect(() => {
    if (routeId) {
      dispatch(
        getRidesByRouteFn({
          route_id: routeId,
          date,
          page: 1,
          perPage: 10,
        })
      );
    }
  }, [dispatch, routeId, date]);

  if (loading) return <p className="text-center mt-4">Loading rides...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  const now = new Date();

  return (
    <div className="p-4  mx-4 lg:mx-44">
      <h2 className="text-xl font-bold mb-4 text-center">Available Rides</h2>

      {data.rides && data.rides.length > 0 ? (
        <div className="space-y-4">
          {data.rides.map((ride) => {
            const startTime = new Date(ride.startTime);
            const endTime = new Date(ride.endTime);
            const isDeparted = startTime < now;

            return (
              <div
                key={ride.id}
                onClick={() => navigate(`/routes/schedules/${ride.id}`)}
                className={`rounded-xl shadow relative overflow-hidden ${
                  isDeparted ? "bg-red-50" : "bg-white"
                }`}
              >
                {/* ===== Top Row ===== */}
                <div className="flex justify-between items-center p-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={"/bus.png"}
                      alt="bus"
                      className="w-20 h-14 object-cover rounded-md"
                    />
                    <div className="flex flex-col">
                      <span className="px-2 py-0.5 text-xs font-bold rounded bg-gray-100 text-gray-700">
                        {ride.vehicle?.name} {ride.vehicle?.vehicleNo}
                      </span>
                      <div className="flex space-x-2 text-xs mt-1">
                        <span className="text-red-500">❄ AC</span>
                        <span className="text-green-500">📶 WiFi</span>
                      </div>
                    </div>
                  </div>

                  <span className="px-2 py-1 text-xs font-bold rounded bg-indigo-100 text-indigo-700">
                    {ride.fareSLSH} SLSH
                  </span>
                </div>

                {/* ===== Middle Section ===== */}
                <div className="px-4 py-2 border-t border-b border-gray-100">
                  <div className="flex justify-between text-sm font-medium">
                    <span>
                      {startTime.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span>
                      {endTime.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {/* Route with dashed line */}
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-600">
                      {ride.route.from}
                    </span>
                    <div className="flex-1 h-0.5 mx-2 border-t-2 border-dashed border-gray-300"></div>
                    <span className="text-xs text-gray-600">
                      {ride.route.end}
                    </span>
                  </div>

                  {/* Duration */}
                  <p className="text-center text-xs text-gray-400 mt-1">
                    {Math.round(
                      (endTime.getTime() - startTime.getTime()) / 60000
                    ) / 60}
                    h Duration
                  </p>
                </div>

                {/* ===== Footer ===== */}
                <div className="px-4 py-2 flex justify-between text-xs text-gray-500">
                  <span>Driver: {ride.driver?.name || "Unknown"}</span>
                  <span>
                    Seats: {ride.takenSeats.length}/{ride.totalSeats}
                  </span>
                </div>

                {/* ===== Status ===== */}
                {isDeparted && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-3 py-1 rounded shadow">
                    DEPARTED
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-500">No rides found.</p>
      )}
    </div>
  );
};

export default GetRidesByRoute;
