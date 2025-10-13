"use client";

import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  EyeIcon,
  Filter,
  MoreHorizontal,
  RefreshCw,
  Trash2,
} from "lucide-react";

import type { AppDispatch, RootState } from "@/redux/store";
import type { Datum } from "@/redux/types/messages";

import ButtonSpinner from "@/components/spinnser";
import {
  deleteMessagesRdu,
  listMessagesFn,
} from "@/redux/slices/messages/listMessages";
import ListHotelsSkeleton from "../../components/skeletons/hotelsSkeleton";
import { useNavigate } from "react-router-dom";

const PER_PAGE = 10;

interface FilterFormValues {
  search: string;
  creator: string;
}

const ListMessages: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: messagesData, loading } = useSelector(
    (s: RootState) => s.listMessagesSlice
  );
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const filterForm = useForm<FilterFormValues>({
    defaultValues: { search: "", creator: "" },
  });
  const watchFilter = filterForm.watch;

  const messages: Datum[] = messagesData?.data ?? [];

  // fetch list on mount / page change
  useEffect(() => {
    dispatch(listMessagesFn({ page, limit: PER_PAGE }));
  }, [dispatch, page]);

  // filtered messages
  const filteredMessages = useMemo(() => {
    const q = watchFilter("search").trim().toLowerCase();
    const creator = watchFilter("creator").trim();

    return messages.filter((msg) => {
      const matchesSearch = q ? msg.message.toLowerCase().includes(q) : true;
      const matchesCreator = creator ? msg.creator.name === creator : true;
      return matchesSearch && matchesCreator;
    });
  }, [messages, watchFilter("search"), watchFilter("creator")]);

  // pagination
  const startIndex = (page - 1) * PER_PAGE;
  const paginatedMessages = filteredMessages.slice(
    startIndex,
    startIndex + PER_PAGE
  );
  const totalPages = Math.max(1, Math.ceil(filteredMessages.length / PER_PAGE));

  // select logic
  const toggleSelect = (id: string) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  const selectAll = () => {
    const pageIds = paginatedMessages.map((m) => m.id);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));
    setSelectedIds((prev) =>
      allSelected
        ? prev.filter((id) => !pageIds.includes(id))
        : [...new Set([...prev, ...pageIds])]
    );
  };

  // refresh
  const refreshList = async () => {
    setRefreshing(true);
    try {
      await dispatch(listMessagesFn({ page, limit: PER_PAGE }));
    } finally {
      setRefreshing(false);
    }
  };

  // delete single
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await dispatch(deleteMessagesRdu(deleteId));
      toast.success("Message deleted successfully");
      await refreshList();
    } catch (err) {
      toast.error("Failed to delete message");
      console.error(err);
    } finally {
      setDeleteId(null);
      setIsDeleteDialogOpen(false);
    }
  };

  // delete selected
  const deleteSelected = async () => {
    if (selectedIds.length === 0) return;
    try {
      await Promise.all(
        selectedIds.map((id) => dispatch(deleteMessagesRdu(id)))
      );
      toast.success("Selected messages deleted");
      setSelectedIds([]);
      await refreshList();
    } catch (err) {
      toast.error("Failed to delete selected messages");
      console.error(err);
    }
  };

  if (loading) return <ListHotelsSkeleton />;

  return (
    <div className="w-full  p-6 dark:bg-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Messages Management</h1>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row sm:justify-between mb-4 gap-2 p-4 shadow-sm dark:bg-slate-900 dark:border rounded-md">
        <div className="flex gap-2 flex-wrap">
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
            onClick={refreshList}
            disabled={refreshing}
          >
            {refreshing ? (
              <ButtonSpinner />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh
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
          placeholder="Search messages..."
          value={watchFilter("search")}
          onChange={(e) => filterForm.setValue("search", e.target.value)}
          className="sm:w-64 mt-2 sm:mt-0"
        />
      </div>

      {/* Messages Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Messages</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox
                    checked={
                      paginatedMessages.length > 0 &&
                      paginatedMessages.every((m) => selectedIds.includes(m.id))
                    }
                    onCheckedChange={selectAll}
                  />
                </TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Creator</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Extra numbers</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedMessages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No messages found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedMessages.map((msg) => (
                  <TableRow key={msg.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(msg.id)}
                        onCheckedChange={() => toggleSelect(msg.id)}
                      />
                    </TableCell>
                    <TableCell>
                      {msg.message.length > 50
                        ? msg.message.slice(0, 50) + "........."
                        : msg.message}
                    </TableCell>
                    <TableCell>{msg.creator.name}</TableCell>
                    <TableCell>{msg.recipients.length}</TableCell>
                    <TableCell>{msg.extraNumbers.length}</TableCell>
                    <TableCell>
                      {new Date(msg.createdAt).toLocaleString()}
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
                            onClick={() => {
                              navigate(`/dashboard/admin/messages/${msg.id}`);
                            }}
                          >
                            <EyeIcon className="mr-2 h-4 w-4" /> View
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
          <div className="flex justify-end items-center gap-2 mt-4 flex-wrap">
            <Button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span>
              Page {page} of {totalPages}
            </span>
            <Button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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
            <form
              className="bg-white dark:bg-slate-800 p-6 rounded-md w-full max-w-md shadow-lg"
              onSubmit={(e) => {
                e.preventDefault();
                setFilterDialogOpen(false);
                toast.success("Filter applied (client-side)");
              }}
            >
              <h2 className="text-xl font-bold mb-4">Filter Messages</h2>

              <FormItem>
                <FormLabel>Creator Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter creator name"
                    value={watchFilter("creator")}
                    onChange={(e) =>
                      filterForm.setValue("creator", e.target.value)
                    }
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
    </div>
  );
};

export default ListMessages;
