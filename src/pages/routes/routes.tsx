import { listRoutesFn } from "@/redux/slices/routes/listAllRoutes";
import type { AppDispatch, RootState } from "@/redux/store";
import { Repeat, Search } from "lucide-react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const RoutesPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.listRoutesSlice
  );
  const navigate = useNavigate();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  // Utility: Get YYYY-MM-DD string for <input type="date" />
  const getYYYYMMDD = (offsetDays = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().slice(0, 10);
  };

  // Default date = today
  const [date, setDate] = useState<string>(getYYYYMMDD(0));

  const [filteredRoutes, setFilteredRoutes] = useState(data.routes || []);

  // Format for displaying dates (DD/MM/YYYY)
  const formatDateDDMMYYYY = (dateStr: string) => {
    const dateObj = new Date(dateStr);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    dispatch(listRoutesFn());
  }, [dispatch]);

  useEffect(() => {
    if (data.routes) {
      setFilteredRoutes(
        data.routes.filter(
          (route) =>
            route.from.toLowerCase().includes(from.toLowerCase()) &&
            route.end.toLowerCase().includes(to.toLowerCase())
        )
      );
    }
  }, [from, to, data.routes]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  return (
    <div className="p-4 max-w-md mx-auto font-sans">
      <Toaster position="bottom-center" />

      {/* Header */}
      <h2 className="text-xl font-bold mb-6 text-center">Book Bus</h2>

      {/* Search Card */}
      <div className="bg-white rounded-2xl shadow p-4 space-y-4">
        {/* From / To */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="text-xs text-gray-500">FROM</label>
            <input
              type="text"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="Enter city"
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring focus:ring-yellow-400 focus:outline-none"
            />
          </div>

          <button
            onClick={() => {
              const temp = from;
              setFrom(to);
              setTo(temp);
            }}
            className="bg-yellow-400 p-2 rounded-full shadow hover:bg-yellow-500 transition"
          >
            <Repeat className="w-4 h-4" />
          </button>

          <div className="flex-1">
            <label className="text-xs text-gray-500">TO</label>
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="Enter city"
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring focus:ring-yellow-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="text-xs text-gray-500">DEPARTURE DATE</label>
          <div className="flex items-center gap-2 mt-1">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="flex-1 border rounded-lg px-3 py-2 focus:ring focus:ring-yellow-400 focus:outline-none"
            />
            <button
              onClick={() => setDate(getYYYYMMDD(0))}
              className="px-3 py-2 rounded-lg bg-gray-100 text-sm hover:bg-gray-200"
            >
              Today
            </button>
            <button
              onClick={() => setDate(getYYYYMMDD(1))}
              className="px-3 py-2 rounded-lg bg-gray-100 text-sm hover:bg-gray-200"
            >
              Tomorrow
            </button>
          </div>
          {date && (
            <p className="text-xs text-gray-500 mt-1">
              Selected: {formatDateDDMMYYYY(date)}
            </p>
          )}
        </div>

        {/* Search Button */}
        <button
          onClick={() =>
            toast.success(
              `Searching ${from} → ${to} on ${formatDateDDMMYYYY(date)}`
            )
          }
          className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 shadow hover:opacity-90 transition"
        >
          <Search className="w-5 h-5" /> Search
        </button>
      </div>

      {/* Popular Routes */}
      <div className="mt-8">
        <h3 className="font-semibold text-lg mb-4">Popular Routes</h3>
        <div className="space-y-3">
          {filteredRoutes.map((route) => (
            <div
              key={route.id}
              onClick={() =>
                navigate(
                  `/routes/${route.id}/rides?date=${formatDateDDMMYYYY(date)}`
                )
              }
              className="flex items-center justify-between bg-white p-4 rounded-xl shadow hover:shadow-md transition cursor-pointer"
            >
              <div>
                <h4 className="font-medium">
                  {route.from} → {route.end}
                </h4>
                <p className="text-xs text-gray-500">
                  Departing: {formatDateDDMMYYYY(date)}
                </p>
              </div>
              <Search className="w-4 h-4 text-gray-400" />
            </div>
          ))}
        </div>
      </div>

      {/* Loading / Empty State */}
      {loading && <p className="text-center text-gray-400 mt-4">Loading...</p>}
      {!loading && filteredRoutes.length === 0 && (
        <p className="text-center text-gray-400 mt-4">No routes found.</p>
      )}
    </div>
  );
};

export default RoutesPage;
