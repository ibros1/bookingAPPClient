"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableHead,
  TableBody,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import {
  Filter,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Trash2,
  Edit,
  User,
} from "lucide-react";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";

import { listEmployeesFn } from "@/redux/slices/emplooyee/listEmplooyee";
import { DeleteEmployeesFn } from "@/redux/slices/emplooyee/deleteEmployee";
import { getOneEmployeeByPhone } from "@/redux/slices/emplooyee/getOneByPhone";
import type { RootState, AppDispatch } from "@/redux/store";
import type { Employee } from "@/redux/types/employees";

import ButtonSpinner from "@/components/spinnser";
import ListHotelsSkeleton from "../../components/skeletons/hotelsSkeleton";

const PER_PAGE = 10;

interface FilterFormValues {
  status: string;
  phone: string;
}

interface EditFormValues {
  name: string;
  phone: string;
  sex: string;
  status: string;
  position: string;
  salary: string;
}

const ListEmployees: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Redux state
  const { data: employeesData, loading } = useSelector(
    (s: RootState) => s.listEmployeesSlice
  );
  const { data: employeeByPhoneData, loading: phoneLoading } = useSelector(
    (s: RootState) => s.getOneEmployeeByNumberSlice
  );

  const employees: Employee[] = employeesData?.employee ?? [];
  const totalPages = employeesData?.totalPages ?? 1;

  // Local state
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const filterForm = useForm<FilterFormValues>({
    defaultValues: { status: "all", phone: "" },
  });

  const editForm = useForm<EditFormValues>({
    defaultValues: {
      name: "",
      phone: "",
      sex: "",
      status: "",
      position: "",
      salary: "",
    },
  });

  const { watch } = filterForm;
  const phoneFilterValue = watch("phone");

  // Fetch employees
  useEffect(() => {
    dispatch(listEmployeesFn({ page, limit: PER_PAGE }));
  }, [dispatch, page]);

  // Refresh list
  const refreshList = async () => {
    setRefreshing(true);
    await dispatch(listEmployeesFn({ page, limit: PER_PAGE }));
    setRefreshing(false);
    toast.success("List refreshed");
  };

  // Handle delete confirmation
  const confirmDelete = (id: string) => {
    setDeleteTargetId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteTargetId) return;
    await dispatch(DeleteEmployeesFn(deleteTargetId));
    toast.success("Employee deleted");
    setDeleteDialogOpen(false);
    refreshList();
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    await Promise.all(selectedIds.map((id) => dispatch(DeleteEmployeesFn(id))));
    setSelectedIds([]);
    toast.success("Selected employees deleted");
    refreshList();
  };

  // Filter logic
  const handleApplyFilter = async () => {
    const phone = watch("phone").trim();
    // const status = watch("status");
    setFilterDialogOpen(false);

    if (phone) {
      await dispatch(getOneEmployeeByPhone({ phone }));
      toast.success("Filter applied by phone");
    } else {
      await dispatch(listEmployeesFn({ page: 1, limit: PER_PAGE }));
      toast.success("Filter applied");
    }
  };

  const clearFilter = async () => {
    filterForm.reset({ phone: "", status: "all" });
    await dispatch(listEmployeesFn({ page: 1, limit: PER_PAGE }));
    toast.success("Filter cleared");
  };

  // Edit logic (mock)
  const openEditDialog = (emp: Employee) => {
    editForm.reset({
      name: emp.name,
      phone: emp.phone,
      sex: emp.sex,
      status: emp.status,
      position: emp.position,
      salary: emp.salary.toString(),
    });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = () => {
    toast.success("Employee updated (mock)");
    setEditDialogOpen(false);
  };

  // Derived employees
  const displayedEmployees = useMemo(() => {
    if (phoneFilterValue && employeeByPhoneData?.employee)
      return [employeeByPhoneData.employee];
    return employees;
  }, [employees, phoneFilterValue, employeeByPhoneData]);

  if (loading || phoneLoading) return <ListHotelsSkeleton />;

  return (
    <div className="p-6 space-y-6 dark:bg-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold">Employee Management</h1>

      {/* === Stats === */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardContent>
            <CardTitle>Total Employees</CardTitle>
            <p className="text-2xl font-bold">{employeesData?.total ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <CardTitle>Active</CardTitle>
            <p className="text-2xl font-bold text-green-500">
              {employees.filter((e) => e.status === "active").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <CardTitle>Inactive</CardTitle>
            <p className="text-2xl font-bold text-red-500">
              {employees.filter((e) => e.status !== "active").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* === Actions === */}
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => navigate("/dashboard/admin/employees/create")}>
            <Plus className="mr-2 h-4 w-4" /> Add Employee
          </Button>

          <Button
            variant="destructive"
            disabled={selectedIds.length === 0}
            onClick={handleBulkDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete Selected
          </Button>

          <Button variant="outline" onClick={() => setFilterDialogOpen(true)}>
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>

          <Button variant="outline" onClick={refreshList} disabled={refreshing}>
            {refreshing ? (
              <ButtonSpinner />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>

          {phoneFilterValue && (
            <Button variant="ghost" onClick={clearFilter}>
              Clear Filter
            </Button>
          )}
        </div>
      </div>

      {/* === Table === */}
      <Card>
        <CardHeader>
          <CardTitle>All Employees</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox
                    checked={
                      displayedEmployees.length > 0 &&
                      displayedEmployees.every((e) =>
                        selectedIds.includes(e.id)
                      )
                    }
                    onCheckedChange={() => {
                      if (
                        displayedEmployees.every((e) =>
                          selectedIds.includes(e.id)
                        )
                      ) {
                        setSelectedIds([]);
                      } else {
                        setSelectedIds(displayedEmployees.map((e) => e.id));
                      }
                    }}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {displayedEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500">
                    No employees found.
                  </TableCell>
                </TableRow>
              ) : (
                displayedEmployees.map((emp) => (
                  <TableRow key={emp.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(emp.id)}
                        onCheckedChange={() =>
                          setSelectedIds((prev) =>
                            prev.includes(emp.id)
                              ? prev.filter((id) => id !== emp.id)
                              : [...prev, emp.id]
                          )
                        }
                      />
                    </TableCell>
                    <TableCell className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      {emp.name}
                    </TableCell>
                    <TableCell>{emp.phone}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          emp.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {emp.status}
                      </span>
                    </TableCell>
                    <TableCell>{emp.position}</TableCell>
                    <TableCell>{emp.salary}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => openEditDialog(emp)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => confirmDelete(emp.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {!phoneFilterValue && totalPages > 1 && (
            <div className="flex justify-end gap-2 mt-4">
              <Button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
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
          )}
        </CardContent>
      </Card>

      {/* === Delete Confirmation Dialog === */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this employee? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirmed}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* === Filter Dialog === */}
      {filterDialogOpen && (
        <FormProvider {...filterForm}>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleApplyFilter();
              }}
              className="bg-white dark:bg-slate-800 p-6 rounded-md shadow-lg w-full max-w-md"
            >
              <h2 className="text-xl font-bold mb-4">Filter Employees</h2>

              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Select
                    value={watch("status")}
                    onValueChange={(val) => filterForm.setValue("status", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>

              <FormItem className="mt-4">
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter phone number"
                    {...filterForm.register("phone")}
                  />
                </FormControl>
              </FormItem>

              <div className="flex justify-end gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setFilterDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Apply</Button>
              </div>
            </form>
          </div>
        </FormProvider>
      )}

      {/* === Edit Dialog === */}
      {editDialogOpen && (
        <FormProvider {...editForm}>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <form
              onSubmit={editForm.handleSubmit(handleEditSubmit)}
              className="bg-white dark:bg-slate-800 p-6 rounded-md shadow-lg w-full max-w-md"
            >
              <h2 className="text-xl font-bold mb-4">Edit Employee</h2>

              {["name", "phone", "sex", "status", "position", "salary"].map(
                (field) => (
                  <FormItem key={field} className="mt-2">
                    <FormLabel className="capitalize">{field}</FormLabel>
                    <FormControl>
                      {field === "status" ? (
                        <Select
                          value={editForm.watch("status")}
                          onValueChange={(val) =>
                            editForm.setValue("status", val)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          {...editForm.register(field as keyof EditFormValues)}
                        />
                      )}
                    </FormControl>
                  </FormItem>
                )
              )}

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

export default ListEmployees;
