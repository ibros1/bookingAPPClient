"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
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
  Filter,
  X,
  HomeIcon,
} from "lucide-react";

import { FormItem, FormLabel, FormControl } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, FormProvider } from "react-hook-form";

import type { AppDispatch, RootState } from "@/redux/store";
import type { Hotel } from "@/redux/types/hotels";

import { listHotelsFn } from "@/redux/slices/hotels/listHotels";
import { DeleteHotelsFn } from "@/redux/slices/hotels/deleteHotel";
import { listAddressFn } from "@/redux/slices/address/listAddress";
import { getHotelsByAddressFn } from "@/redux/slices/hotels/getHotelsByaddress";
import {
  resetupdateHotelstate,
  updateHotelsFn,
} from "@/redux/slices/hotels/updateHotel";
import { listBookersFn } from "@/redux/slices/bookers/listBookers";
import ListHotelsSkeleton from "../../components/skeletons/hotelsSkeleton";

interface FilterFormValues {
  booker: string;
  addressId: string;
}

interface EditFormValues {
  name: string;
  addressId: string;
  bookerId: string;
}

const ListHotels: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { data: allHotelsData, loading: allLoading } = useSelector(
    (state: RootState) => state.listHotelsSlice
  );
  const { data: filteredHotelsData, loading: filteredLoading } = useSelector(
    (state: RootState) => state.getHotelsByAddressSlice
  );
  const { data: addressData } = useSelector(
    (state: RootState) => state.listAddressSlice
  );
  const { data: bookerData } = useSelector(
    (state: RootState) => state.listBookersSlice
  );

  const hotels: Hotel[] = allHotelsData?.hotels || [];
  const addresses = addressData?.address || [];
  const bookers = bookerData?.bookers || [];

  const [page, setPage] = useState(1);
  const perPage = 10;
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editHotelId, setEditHotelId] = useState<string | null>(null);

  const filterForm = useForm<FilterFormValues>({
    defaultValues: { booker: "", addressId: "" },
  });
  const editForm = useForm<EditFormValues>({
    defaultValues: { name: "", addressId: "", bookerId: "" },
  });

  const watchFilter = filterForm.watch;
  const watchEdit = editForm.watch;

  useEffect(() => {
    dispatch(listHotelsFn({ page, perPage }));
    dispatch(listAddressFn({ page: 1, perPage: 100 }));
    dispatch(listBookersFn({ page: 1, perPage: 100 }));
  }, [dispatch, page, perPage]);

  const bookerState = useSelector((state: RootState) => state.listBookersSlice);

  const handleDelete = () => {
    if (!deleteId) return;
    dispatch(DeleteHotelsFn(deleteId));
    setDeleteId(null);
    setIsDeleteDialogOpen(false);
    toast.success("Hotel deleted successfully");
    dispatch(listHotelsFn({ page, perPage }));
    if (watchFilter("addressId"))
      dispatch(
        getHotelsByAddressFn({
          addressId: watchFilter("addressId"),
          page: 1,
          perPage,
        })
      );
  };

  const deleteSelected = () => {
    if (selectedIds.length === 0) return;
    selectedIds.forEach((id) => dispatch(DeleteHotelsFn(id)));
    setSelectedIds([]);
    toast.success("Selected hotels deleted successfully");
    if (watchFilter("addressId"))
      dispatch(
        getHotelsByAddressFn({
          addressId: watchFilter("addressId"),
          page: 1,
          perPage,
        })
      );
    else dispatch(listHotelsFn({ page, perPage }));
  };

  const handleApplyFilter = () => {
    if (watchFilter("addressId"))
      dispatch(
        getHotelsByAddressFn({
          addressId: watchFilter("addressId"),
          page: 1,
          perPage,
        })
      );
    setPage(1);
    setFilterDialogOpen(false);
  };

  const handleClearFilter = () => {
    filterForm.reset();
    dispatch(listHotelsFn({ page, perPage }));
    setPage(1);
  };

  const currentHotels =
    watchFilter("addressId") && filteredHotelsData?.hotels
      ? filteredHotelsData.hotels
      : hotels;

  const filteredHotels = currentHotels.filter((h) => {
    const matchesSearch = h.name.toLowerCase().includes(search.toLowerCase());
    const matchesBooker =
      watchFilter("booker") === "" ||
      h.booker?.name
        .toLowerCase()
        .includes(watchFilter("booker").toLowerCase());
    return matchesSearch && matchesBooker;
  });

  const startIndex = (page - 1) * perPage;
  const paginatedHotels = filteredHotels.slice(
    startIndex,
    startIndex + perPage
  );
  const totalPages = Math.max(1, Math.ceil(filteredHotels.length / perPage));

  const toggleSelect = (id: string) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  const selectAll = () => {
    const pageIds = paginatedHotels.map((h) => h.id);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));
    setSelectedIds((prev) =>
      allSelected
        ? prev.filter((id) => !pageIds.includes(id))
        : [...new Set([...prev, ...pageIds])]
    );
  };

  const totalHotels = currentHotels.length;
  const totalBookers = currentHotels.reduce(
    (acc, h) => (h.booker ? acc + 1 : acc),
    0
  );

  const openEditDialog = (hotel: Hotel) => {
    setEditHotelId(hotel.id);
    editForm.reset({
      name: hotel.name,
      addressId: hotel.addressId || "",
      bookerId: hotel.bookerId || "",
    });
    setEditDialogOpen(true);
  };

  const updateState = useSelector(
    (state: RootState) => state.UpdateHotelsSlice
  );

  useEffect(() => {
    if (updateState.error) {
      toast.dismiss();
      toast.error(updateState.error);
      return;
    }
    if (updateState.loading) {
      toast.dismiss();
      toast.loading("Updating hotel...");
      return;
    }
    if (updateState.data?.isSuccess) {
      toast.dismiss();
      toast.success("Hotel updated successfully");
      dispatch(listHotelsFn({ page, perPage }));
      dispatch(listAddressFn({ page: 1, perPage: 100 }));
      dispatch(listBookersFn({ page: 1, perPage: 100 }));
      setEditDialogOpen(false);
      dispatch(resetupdateHotelstate());
    }
  }, [updateState, dispatch, page, perPage]);

  const handleEditSubmit = (data: EditFormValues) => {
    if (!editHotelId) return;
    dispatch(updateHotelsFn({ id: editHotelId, ...data }));
  };

  if (allLoading || filteredLoading || bookerState.loading)
    return <ListHotelsSkeleton />;

  return (
    <div className="w-full  p-6 dark:bg-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Hotel Management</h1>

      {/* Stats */}
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Hotels */}
        <Card className="p-4 shadow-sm hover:shadow-md transition-shadow rounded-lg">
          <CardContent className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold text-gray-600">
                Total Hotels
              </CardTitle>
              <p className="text-xl font-bold mt-1">{totalHotels}</p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-slate-800 rounded-full">
              <HomeIcon />
            </div>
          </CardContent>
        </Card>

        {/* Total Bookers */}
        <Card className="p-4 shadow-sm hover:shadow-md transition-shadow rounded-lg">
          <CardContent className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold text-gray-600">
                Total Bookers
              </CardTitle>
              <p className="text-xl font-bold mt-1">{totalBookers}</p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-slate-800 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500 dark:text-gray-100"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Optional: Active Bookings */}
        <Card className="p-4 shadow-sm hover:shadow-md transition-shadow rounded-lg">
          <CardContent className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold text-gray-600">
                Active Bookings
              </CardTitle>
              <p className="text-xl font-bold mt-1">128</p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-slate-800 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500 dark:text-gray-100"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7h18M3 12h18M3 17h18"
                />
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Optional: Pending Requests */}
        <Card className="p-4 shadow-sm hover:shadow-md transition-shadow rounded-lg">
          <CardContent className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold text-gray-600">
                Pending Requests
              </CardTitle>
              <p className="text-xl font-bold mt-1">24</p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-slate-800 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500 dark:text-gray-100"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3"
                />
              </svg>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row sm:justify-between mb-4 gap-2 p-4 shadow-sm dark:bg-slate-900 dark:border rounded-md">
        <div className="flex gap-2 flex-wrap">
          <Button variant="default" size="sm">
            <Plus className="mr-2 h-4 w-4" /> Add Hotel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            disabled={selectedIds.length === 0}
            onClick={deleteSelected}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete{" "}
            {selectedIds.length > 0 && `(${selectedIds.length})`}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (watchFilter("addressId"))
                dispatch(
                  getHotelsByAddressFn({
                    addressId: watchFilter("addressId"),
                    page,
                    perPage,
                  })
                );
              else dispatch(listHotelsFn({ page, perPage }));
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
          </Button>
          {watchFilter("addressId") && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilter}
              className="flex items-center gap-1"
            >
              <X className="h-4 w-4" /> Clear Filter
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilterDialogOpen(true)}
          >
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
        </div>
        <Input
          placeholder="Search hotels..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:w-64 mt-2 sm:mt-0"
        />
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Hotels</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox
                    checked={
                      paginatedHotels.length > 0 &&
                      paginatedHotels.every((h) => selectedIds.includes(h.id))
                    }
                    onCheckedChange={selectAll}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Booker</TableHead>
                <TableHead>Phone_number</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedHotels.length > 0 ? (
                paginatedHotels.map((hotel) => (
                  <TableRow key={hotel.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(hotel.id)}
                        onCheckedChange={() => toggleSelect(hotel.id)}
                      />
                    </TableCell>
                    <TableCell>{hotel.name}</TableCell>
                    <TableCell>
                      {addresses.find((a) => a.id === hotel.addressId)
                        ?.address || "-"}
                    </TableCell>
                    <TableCell>
                      {bookers.find((b) => b.id === hotel.bookerId)?.name ||
                        "-"}
                    </TableCell>
                    <TableCell>
                      {bookers.find((b) => b.id === hotel.bookerId)?.phone ||
                        "-"}
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
                            onClick={() => openEditDialog(hotel)}
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setDeleteId(hotel.id);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No hotels found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex justify-end items-center gap-2 mt-4 flex-wrap">
            <Button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <span>
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

      {/* Filter Dialog */}
      {filterDialogOpen && (
        <FormProvider {...filterForm}>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <form className="bg-white dark:bg-slate-800 p-6 rounded-md w-full max-w-md shadow-lg">
              <h2 className="text-xl font-bold mb-4">Filter Hotels</h2>

              <FormItem>
                <FormLabel>Filter by Booker Name</FormLabel>
                <FormControl>
                  <Input
                    {...filterForm.register("booker")}
                    placeholder="Booker name"
                  />
                </FormControl>
              </FormItem>

              <FormItem>
                <FormLabel>Filter by Address</FormLabel>
                <FormControl>
                  <Select
                    value={watchFilter("addressId")}
                    onValueChange={(val) =>
                      filterForm.setValue("addressId", val)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select address" />
                    </SelectTrigger>
                    <SelectContent>
                      {addresses.map((add) => (
                        <SelectItem key={add.id} value={add.id}>
                          {add.address}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>

              <div className="flex justify-end gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    filterForm.reset();
                    setFilterDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleApplyFilter}>Apply</Button>
              </div>
            </form>
          </div>
        </FormProvider>
      )}

      {/* Edit Dialog */}
      {editDialogOpen && (
        <FormProvider {...editForm}>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <form
              onSubmit={editForm.handleSubmit(handleEditSubmit)}
              className="bg-white dark:bg-slate-800 p-6 rounded-md w-full max-w-md shadow-lg"
            >
              <h2 className="text-xl font-bold mb-4">Edit Hotel</h2>

              <FormItem>
                <FormLabel>Hotel Name</FormLabel>
                <FormControl>
                  <Input
                    {...editForm.register("name")}
                    placeholder="Hotel name"
                  />
                </FormControl>
              </FormItem>

              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Select
                    value={watchEdit("addressId")}
                    onValueChange={(val) => editForm.setValue("addressId", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select address" />
                    </SelectTrigger>
                    <SelectContent>
                      {addresses.map((add) => (
                        <SelectItem key={add.id} value={add.id}>
                          {add.address}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>

              <FormItem>
                <FormLabel>Booker</FormLabel>
                <FormControl>
                  <Select
                    value={watchEdit("bookerId")}
                    onValueChange={(val) => editForm.setValue("bookerId", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select booker" />
                    </SelectTrigger>
                    <SelectContent>
                      {bookers.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>

              <div className="flex justify-end gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </div>
        </FormProvider>
      )}
    </div>
  );
};

export default ListHotels;
