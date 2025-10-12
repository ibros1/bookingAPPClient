"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { FormProvider, useForm, Controller } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  UsersIcon,
  CheckCircle2,
  XCircle,
  Filter,
  RefreshCw,
  MoreHorizontal,
  Edit,
  Trash2,
  Wifi,
} from "lucide-react";

import LoadingPages from "@/components/loading";
import type { AppDispatch, RootState } from "@/redux/store";
import type { User } from "@/redux/types/user";
import { listUsersFn } from "@/redux/slices/users/getAllUsers";
import { Checkbox } from "@/components/ui/checkbox";

interface FilterFormValues {
  role: string;
}

interface EditFormValues {
  name: string;
  phone: string;
  address: string;
  email: string;
}

const Users: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.listUsersSlice
  );

  const users: User[] = data?.users || [];
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  const filterForm = useForm<FilterFormValues>({ defaultValues: { role: "" } });
  const editForm = useForm<EditFormValues>({
    defaultValues: { name: "", phone: "", address: "", email: "" },
  });

  useEffect(() => {
    dispatch(listUsersFn({ page, perPage }));
  }, [dispatch, page, perPage]);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) &&
      (filterForm.watch("role") === "" || u.role === filterForm.watch("role"))
  );

  const startIndex = (page - 1) * perPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + perPage);
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / perPage));

  const toggleSelect = (id: string) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  const selectAll = () => {
    const pageIds = paginatedUsers.map((u) => u.id);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));
    setSelectedIds((prev) =>
      allSelected
        ? prev.filter((id) => !pageIds.includes(id))
        : [...new Set([...prev, ...pageIds])]
    );
  };

  const openEditDialog = (user: User) => {
    setEditUser(user);
    editForm.reset({
      name: user.name || "",
      phone: user.phone || "",
      address: user.address || "",
      email: user.email || "",
    });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = (data: EditFormValues) => {
    toast.success("User info updated (mock)");
    setEditDialogOpen(false);
  };

  const openDeleteDialog = (id: string) => {
    setDeleteUserId(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    toast.success("User deleted (mock)");
    setDeleteDialogOpen(false);
    setDeleteUserId(null);
  };

  const handleApplyFilter = () => {
    setPage(1);
    setFilterDialogOpen(false);
  };

  if (error) {
    toast.error(error);
    return null;
  }

  if (loading) return <LoadingPages message="Loading users..." />;

  // Stats
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.isActive).length;
  const inactiveUsers = totalUsers - activeUsers;

  return (
    <div className="w-full min-h-screen p-6 text-gray-900">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">
        User Management
      </h1>

      {/* Dashboard-style Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className=" border  shadow-sm">
          <CardContent className=" flex items-center justify-between p-6">
            <div>
              <p className="text-sm dark:text-white font-medium text-gray-500">
                Total Users
              </p>
              <p className="text-2xl font-bold dark:text-white text-gray-800">
                {totalUsers}
              </p>
            </div>
            <div className="bg-green-500/10 p-3 rounded-full">
              <UsersIcon className="text-green-600" size={28} />
            </div>
          </CardContent>
        </Card>

        <Card className=" border  shadow-sm">
          <CardContent className=" flex items-center justify-between p-6">
            <div>
              <p className="text-sm dark:text-white font-medium text-gray-500">
                Active Users
              </p>
              <p className="text-2xl font-bold dark:text-white text-gray-800">
                {activeUsers}
              </p>
            </div>
            <div className="bg-emerald-500/10 p-3 rounded-full">
              <CheckCircle2 className="text-emerald-600" size={28} />
            </div>
          </CardContent>
        </Card>

        <Card className=" border  shadow-sm">
          <CardContent className=" flex items-center justify-between p-6">
            <div>
              <p className="text-sm dark:text-white font-medium text-gray-500">
                Inactive Users
              </p>
              <p className="text-2xl font-bold dark:text-white text-gray-800">
                {inactiveUsers}
              </p>
            </div>
            <div className="bg-red-500/10 p-3 rounded-full">
              <XCircle className="text-red-600" size={28} />
            </div>
          </CardContent>
        </Card>
        <Card className=" border  shadow-sm">
          <CardContent className=" flex items-center justify-between p-6">
            <div>
              <p className="text-sm dark:text-white font-medium text-gray-500">
                Online Users
              </p>
              <p className="text-2xl font-bold dark:text-white text-gray-800">
                {totalUsers - inactiveUsers - 3}
              </p>
            </div>
            <div className="bg-red-500/10 p-3 rounded-full">
              <Wifi className="text-red-600" size={28} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row sm:justify-between mb-4 gap-2 p-4 border rounded-md bg-white dark:bg-slate-900 dark:text-white">
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="destructive"
            size="sm"
            disabled={selectedIds.length === 0}
            onClick={() => toast.success("Selected users deleted (mock)")}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete{" "}
            {selectedIds.length > 0 && `(${selectedIds.length})`}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => dispatch(listUsersFn({ page, perPage }))}
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilterDialogOpen(true)}
          >
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
        </div>
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:w-64 mt-2 sm:mt-0"
        />
      </div>

      {/* Table */}
      <Card className="">
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox
                    checked={paginatedUsers.every((u) =>
                      selectedIds.includes(u.id)
                    )}
                    onCheckedChange={selectAll}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(user.id)}
                        onCheckedChange={() => toggleSelect(user.id)}
                      />
                    </TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>{user.address || "-"}</TableCell>
                    <TableCell>{user.email || "-"}</TableCell>
                    <TableCell>
                      {user.isActive ? (
                        <span className="text-green-600 font-medium">
                          Active
                        </span>
                      ) : (
                        <span className="text-red-600 font-medium">
                          Inactive
                        </span>
                      )}
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
                            onClick={() => openEditDialog(user)}
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openDeleteDialog(user.id)}
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
                  <TableCell colSpan={7} className="text-center py-4">
                    No users found
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

      {/* Filter Dialog */}
      {filterDialogOpen && (
        <FormProvider {...filterForm}>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <form className="bg-white p-6 rounded-md w-full max-w-md shadow-lg">
              <h2 className="text-xl font-bold mb-4">Filter Users</h2>
              <Controller
                control={filterForm.control}
                name="role"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Roles</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="officer">Officer</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <div className="flex justify-end gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setFilterDialogOpen(false)}
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
      {editDialogOpen && editUser && (
        <FormProvider {...editForm}>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <form
              onSubmit={editForm.handleSubmit(handleEditSubmit)}
              className="bg-white p-6 rounded-md w-full max-w-md shadow-lg"
            >
              <h2 className="text-xl font-bold mb-4">Edit User</h2>
              <div className="flex flex-col gap-4">
                <Input placeholder="Name" {...editForm.register("name")} />
                <Input placeholder="Phone" {...editForm.register("phone")} />
                <Input
                  placeholder="Address"
                  {...editForm.register("address")}
                />
                <Input placeholder="Email" {...editForm.register("email")} />
              </div>
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

      {/* Delete Dialog */}
      {deleteDialogOpen && deleteUserId && (
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete User</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this user? This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default Users;
