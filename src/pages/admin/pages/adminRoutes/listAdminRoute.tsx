"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AppDispatch, RootState } from "@/redux/store";
import {
  Edit,
  Eye,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import { listRoutesFn } from "@/redux/slices/routes/listRoutes";
import { updateRoutesFn } from "@/redux/slices/routes/updateRoutes";
import type { Route } from "@/redux/types/routes";
import { Link } from "react-router-dom";
import AllRoutesSkeleton from "../../components/skeletons/routesSkeleton";

interface FormValues {
  routeName: string;
  startLocation: string;
  endLocation: string;
}

const AllRoutes: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading } = useSelector(
    (state: RootState) => state.listRoutesSlice
  );

  const [page, setPage] = useState(1);
  const perPage = 10;
  const [search, setSearch] = useState("");
  const [sortColumn, ] = useState<keyof Route>("from");
  const [sortOrder, ] = useState<"asc" | "desc">("asc");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { handleSubmit, control, reset } = useForm<FormValues>({
    defaultValues: { routeName: "", startLocation: "", endLocation: "" },
  });

  // Fetch routes
  useEffect(() => {
    dispatch(
      listRoutesFn({
        page,
        perPage,
      })
    );
  }, [dispatch, refreshTrigger, page, perPage]);

  const routes: Route[] = data?.routes || [];

  // Filter & sort
  const filteredRoutes = routes.filter((r) =>
    [r.from, r.end].some((field) =>
      field.toLowerCase().includes(search.toLowerCase())
    )
  );

  const sortedRoutes = [...filteredRoutes].sort((a, b) => {
    const aValue = a[sortColumn] ?? "";
    const bValue = b[sortColumn] ?? "";
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    return 0;
  });

  const startIndex = (page - 1) * perPage;
  const paginatedRoutes = sortedRoutes.slice(startIndex, startIndex + perPage);
  const totalRoutes = data?.total || routes.length;
  const totalPages = Math.max(1, Math.ceil(totalRoutes / perPage));

  // Selection handlers
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    const pageIds = paginatedRoutes.map((r) => r.id);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));
    if (allSelected)
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    else setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
  };

  const deleteSelected = () => {
    console.log("Deleting IDs:", selectedIds);
  };

  // Populate form when editing
  useEffect(() => {
    if (editingRoute) {
      reset({
        routeName: `${editingRoute.from} - ${editingRoute.end}`,
        startLocation: editingRoute.from,
        endLocation: editingRoute.end,
      });
    }
  }, [editingRoute, reset]);

  const onSubmit = (values: FormValues) => {
    if (!editingRoute) return;

    dispatch(
      updateRoutesFn({
        id: editingRoute.id.toString(),
        from: values.startLocation, // ✅ Use updated value
        end: values.endLocation, // ✅ Use updated value
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Route updated successfully!");
        setEditingRoute(null); // ✅ Close modal
        setRefreshTrigger((prev) => prev + 1); // ✅ Refresh list
      })
      .catch(() => toast.error("Failed to update route"));
  };

  if (loading) return <AllRoutesSkeleton />;

  return (
    <div className="w-screen lg:w-full p-6">
      <h1 className="text-3xl font-bold mb-4">Route Management</h1>

      {/* Actions */}
      <div className="flex flex-col flex-wrap sm:flex-row sm:justify-between mb-4 gap-2 px-4 py-4 shadow-sm dark:bg-slate-900 dark:border rounded-md">
        <div className="flex gap-2">
          <Link to={"/dashboard/admin/routes/create"}>
            <Button variant="default" size="sm">
              <Plus className="mr-2 h-4 w-4" /> Add Route
            </Button>
          </Link>
          <Button
            variant="destructive"
            size="sm"
            disabled={selectedIds.length === 0}
            onClick={deleteSelected}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete{selectedIds.length > 0 && ` (${selectedIds.length})`}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRefreshTrigger((prev) => prev + 1)}
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
          </Button>
        </div>
        <Input
          placeholder="Search routes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:w-64"
        />
      </div>

      {/* Routes Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Routes</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox
                    checked={
                      paginatedRoutes.length > 0 &&
                      paginatedRoutes.every((r) => selectedIds.includes(r.id))
                    }
                    onCheckedChange={selectAll}
                  />
                </TableHead>
                <TableHead>From</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRoutes.length > 0 ? (
                paginatedRoutes.map((route) => (
                  <TableRow key={route.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(route.id)}
                        onCheckedChange={() => toggleSelect(route.id)}
                      />
                    </TableCell>
                    <TableCell>{route.from}</TableCell>
                    <TableCell>{route.end}</TableCell>
                    <TableCell>
                      {new Date(route.updatedAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => setEditingRoute(route)}
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" /> View
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No routes found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex justify-end space-x-2 mt-4">
            <Button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <span className="flex items-center px-2">
              Page {page} of {totalPages}
            </span>
            <Button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      {editingRoute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white dark:bg-slate-800 p-6 rounded-md w-full max-w-md shadow-lg"
          >
            <h2 className="text-xl font-bold mb-4">Edit Route</h2>
            <div className="flex flex-col gap-4">
              <div>
                <Label htmlFor="routeName">Route Name</Label>
                <div className={`flex items-center justify-between`}>
                  <Controller
                    name="routeName"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="startLocation">Start Location</Label>
                <Controller
                  name="startLocation"
                  control={control}
                  render={({ field }) => <Input {...field} />}
                />
              </div>
              <div>
                <Label htmlFor="endLocation">End Location</Label>
                <Controller
                  name="endLocation"
                  control={control}
                  render={({ field }) => <Input {...field} />}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingRoute(null)}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AllRoutes;
