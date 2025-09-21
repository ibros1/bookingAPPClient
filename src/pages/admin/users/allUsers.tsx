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
// Make sure you have a slice for all users
// Optional skeleton component
import { useLocation } from "react-router-dom";
import { listUsersFn } from "@/redux/slices/users/listAllUsers";
import DriverSkeleton from "../components/skeletons/driverSkeleton";

const AllUsers: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.listUsersSlice
  );
  const location = useLocation();

  const [page, setPage] = useState(1);
  const limit = 10;
  const [search, setSearch] = useState("");
  const [sortColumn, setSortColumn] =
    useState<keyof (typeof data.users)[0]>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Fetch users on mount and when page changes
  useEffect(() => {
    dispatch(listUsersFn({ page, size: limit }));
  }, [dispatch, page]);

  // Refresh if navigated with state
  useEffect(() => {
    if (location.state?.refresh) {
      dispatch(listUsersFn({ page, size: limit }));
    }
  }, [dispatch, page, limit, location.state]);

  if (loading) return <DriverSkeleton />;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  const users = data?.users || [];

  const filteredUsers = users.filter((u) =>
    [u.name, u.email, u.phone, u.role].some((field) =>
      String(field).toLowerCase().includes(search.toLowerCase())
    )
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aValue = a[sortColumn] ?? "";
    const bValue = b[sortColumn] ?? "";
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sortedUsers.length / limit));
  const paginatedUsers = sortedUsers.slice((page - 1) * limit, page * limit);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">All Users</h1>

      <div className="flex justify-between mb-4">
        <Input
          placeholder="Search users..."
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
            <TableHead>Created At</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {paginatedUsers.length > 0 ? (
            paginatedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone || "—"}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.isVerified ? "Yes" : "No"}</TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  })}
                </TableCell>
                <TableCell>
                  {new Date(user.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
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
              <TableCell colSpan={8} className="text-center py-4">
                No users found
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

export default AllUsers;
