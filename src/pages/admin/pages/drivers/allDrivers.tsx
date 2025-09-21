"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { AppDispatch, RootState } from "@/redux/store";
import { Eye } from "lucide-react";
import { listDriversFn } from "@/redux/slices/users/access/drivers";
import DriverSkeleton from "../../components/skeletons/driverSkeleton";
import { useLocation } from "react-router-dom";

const ListAllDrivers: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.listDriversSlice
  );
  const location = useLocation();
  const [page, setPage] = useState(1);
  const limit = 10;
  useEffect(() => {
    if (location.state?.rerfresh) {
      dispatch(
        listDriversFn({
          page,
          limit,
        })
      );
    }
  }, [dispatch, page]);
  const [search, setSearch] = useState("");
  const [sortColumn, setSortColumn] =
    useState<keyof (typeof data.drivers)[0]>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    dispatch(listDriversFn({ page, limit }));
  }, [dispatch, page, limit]);

  if (loading) return <DriverSkeleton />;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  const drivers = data?.drivers || [];

  const filteredDrivers = drivers.filter((d) =>
    [d.name, d.email, d.phone || "", d.role].some((field) =>
      field.toLowerCase().includes(search.toLowerCase())
    )
  );

  const sortedDrivers = [...filteredDrivers].sort((a, b) => {
    const aValue = a[sortColumn] ?? "";
    const bValue = b[sortColumn] ?? "";
    if (typeof aValue === "string" && typeof bValue === "string")
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sortedDrivers.length / limit));
  const paginatedDrivers = sortedDrivers.slice(
    (page - 1) * limit,
    page * limit
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">All Drivers</h1>

      <div className="flex justify-between mb-4">
        <Input
          placeholder="Search drivers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:w-64"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer"
              onClick={() => {
                setSortColumn("name");
                setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
              }}
            >
              Name{" "}
              {sortColumn === "name" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Verified</TableHead>
            <TableHead>Car No</TableHead>
            <TableHead>Created_at</TableHead>
            <TableHead>Updated_at</TableHead>

            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {paginatedDrivers.length > 0 ? (
            paginatedDrivers.map((driver) => (
              <TableRow key={driver.id}>
                <TableCell>{driver.name}</TableCell>
                <TableCell>{driver.email}</TableCell>
                <TableCell>{driver.phone || "—"}</TableCell>
                <TableCell>{driver.role}</TableCell>
                <TableCell>{driver.isVerified ? "Yes" : "No"}</TableCell>
                <TableCell>{driver.vehicle[0]?.vehicleNo}</TableCell>

                <TableCell>
                  {new Date(driver.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </TableCell>
                <TableCell>
                  {new Date(driver.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </TableCell>

                <TableCell>
                  <Button size="sm" variant="outline">
                    <Eye className="mr-1 h-4 w-4" /> View
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                No drivers found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

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
    </div>
  );
};

export default ListAllDrivers;
