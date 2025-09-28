"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import type { AppDispatch, RootState } from "@/redux/store";
import { listAddressFn } from "@/redux/slices/address/listAddress";
import {
  resetupdateAddressState,
  updateAddresssFn,
} from "@/redux/slices/address/updateAddress";
import {
  DeleteAddressFn,
  resetAddressRdu,
} from "@/redux/slices/address/deleteAddress";
import { listofficersFn } from "@/redux/slices/officers/listOfficer";

import type { Address, Officer } from "@/redux/types/address";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FormItem, FormLabel, FormControl } from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  Plus,
  Trash2,
  RefreshCw,
  Edit,
  MoreHorizontal,
  Eye,
} from "lucide-react";

import AllRoutesSkeleton from "../../components/skeletons/routesSkeleton";

interface FormValues {
  address: string;
  officerId: string;
}

const AllAddresses: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Redux state
  const { data, loading } = useSelector(
    (state: RootState) => state.listAddressSlice
  );
  const { data: officersData } = useSelector(
    (state: RootState) => state.listofficersSlice
  );
  const updateState = useSelector(
    (state: RootState) => state.UpdateAddresssSlice
  );
  const deleteState = useSelector(
    (state: RootState) => state.DeleteAddressSlice
  );

  const officers: Officer[] = officersData?.officers || [];
  const addresses: Address[] = data?.address || [];

  // Local states
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const perPage = 10;

  // Edit form
  const editForm = useForm<FormValues>({
    defaultValues: { address: "", officerId: "" },
  });

  // Fetch officers and addresses
  useEffect(() => {
    dispatch(listofficersFn({ page, perPage }));
  }, [dispatch, page, perPage]);

  useEffect(() => {
    dispatch(listAddressFn({ page, perPage }));
  }, [dispatch, page, perPage, refreshTrigger]);

  // Populate edit form
  useEffect(() => {
    if (editingAddress) {
      editForm.reset({
        address: editingAddress.address,
        officerId: editingAddress.officerId || "",
      });
    }
  }, [editingAddress, editForm]);

  // Update feedback
  useEffect(() => {
    if (updateState.error) {
      toast.dismiss();
      toast.error(updateState.error);
      dispatch(resetupdateAddressState());
    } else if (updateState.loading) {
      toast.dismiss();
      toast.loading("Updating address...");
    } else if (updateState.data?.isSuccess) {
      toast.dismiss();
      toast.success("Address updated successfully!");
      setEditingAddress(null);
      dispatch(listAddressFn({ page, perPage }));
      dispatch(resetupdateAddressState());
    }
  }, [updateState, dispatch, page, perPage]);

  // Delete feedback
  useEffect(() => {
    if (deleteState.error) {
      toast.dismiss();
      toast.error(deleteState.error);
      dispatch(resetAddressRdu());
    } else if (deleteState.loading) {
      toast.dismiss();
      toast.loading("Deleting address...");
    } else if (deleteState.data?.isSuccess) {
      toast.dismiss();
      toast.success("Address deleted successfully!");
      setDeleteId(null);
      setIsDeleteDialogOpen(false);
      dispatch(listAddressFn({ page, perPage }));
      dispatch(resetAddressRdu());
    }
  }, [deleteState, dispatch, page, perPage]);

  // Handlers
  const handleEditSubmit = (values: FormValues) => {
    if (!editingAddress) return;
    dispatch(updateAddresssFn({ id: editingAddress.id, ...values }));
  };

  const handleDelete = () => {
    if (deleteId) dispatch(DeleteAddressFn(deleteId));
  };

  const deleteSelected = () => {
    selectedIds.forEach((id) => dispatch(DeleteAddressFn(id)));
    setSelectedIds([]);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    const pageIds = paginatedAddresses.map((a) => a.id);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));
    setSelectedIds((prev) =>
      allSelected
        ? prev.filter((id) => !pageIds.includes(id))
        : [...new Set([...prev, ...pageIds])]
    );
  };

  // Search + Pagination
  const filtered = addresses.filter((a) =>
    a.address.toLowerCase().includes(search.toLowerCase())
  );
  const start = (page - 1) * perPage;
  const paginatedAddresses = filtered.slice(start, start + perPage);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));

  if (loading) return <AllRoutesSkeleton />;

  return (
    <div className="w-screen lg:w-full p-6">
      <h1 className="text-3xl font-bold mb-4">Address Management</h1>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row sm:justify-between mb-4 gap-2 px-4 py-4 shadow-sm dark:bg-slate-900 dark:border rounded-md">
        <div className="flex gap-2 flex-wrap">
          <Link to="/dashboard/admin/addresses/create">
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" /> Add Address
            </Button>
          </Link>
          <Button
            variant="destructive"
            size="sm"
            disabled={selectedIds.length === 0}
            onClick={deleteSelected}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete {selectedIds.length > 0 && `(${selectedIds.length})`}
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
          placeholder="Search addresses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:w-64 mt-2 sm:mt-0"
        />
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Addresses</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox
                    checked={
                      paginatedAddresses.length > 0 &&
                      paginatedAddresses.every((a) =>
                        selectedIds.includes(a.id)
                      )
                    }
                    onCheckedChange={selectAll}
                  />
                </TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Officer</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedAddresses.length > 0 ? (
                paginatedAddresses.map((addr) => (
                  <TableRow key={addr.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(addr.id)}
                        onCheckedChange={() => toggleSelect(addr.id)}
                      />
                    </TableCell>
                    <TableCell>{addr.address}</TableCell>
                    <TableCell>{addr.officer?.name || "-"}</TableCell>
                    <TableCell>{addr.officer?.phone || "-"}</TableCell>
                    <TableCell>
                      {new Date(addr.updatedAt).toLocaleString()}
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
                            onClick={() => setEditingAddress(addr)}
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setDeleteId(addr.id);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
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
                  <TableCell colSpan={6} className="text-center py-4">
                    No addresses found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex justify-end items-center space-x-2 mt-4">
            <Button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <span className="px-2">
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

      {/* Edit Dialog */}
      {editingAddress && (
        <FormProvider {...editForm}>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <form
              onSubmit={editForm.handleSubmit(handleEditSubmit)}
              className="bg-white dark:bg-slate-800 p-6 rounded-md w-full max-w-md shadow-lg"
            >
              <h2 className="text-xl font-bold mb-4">Edit Address</h2>
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input
                    {...editForm.register("address")}
                    placeholder="Address name"
                  />
                </FormControl>
              </FormItem>
              <FormItem className="mt-4">
                <FormLabel>Officer</FormLabel>
                <FormControl>
                  <Controller
                    name="officerId"
                    control={editForm.control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select officer" />
                        </SelectTrigger>
                        <SelectContent>
                          {officers.map((o) => (
                            <SelectItem key={o.id} value={o.id}>
                              {o.name} ({o.phone})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormControl>
              </FormItem>
              <div className="flex justify-end gap-2 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingAddress(null)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </div>
        </FormProvider>
      )}

      {/* Delete Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AllAddresses;
