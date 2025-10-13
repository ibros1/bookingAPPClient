import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";

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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  Activity,
  User,
  MoreHorizontal,
  RefreshCw,
  Filter,
  FileBarChart,
} from "lucide-react";
import { listLogsFn } from "@/redux/slices/logs/listActivity";

const ListAdminLogs: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.listLogsSlice
  );

  const [page, setPage] = useState(1);
  const perPage = 10;
  const [search, setSearch] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const [viewLog, setViewLog] = useState<any>(null);

  // Fetch Logs
  useEffect(() => {
    dispatch(listLogsFn({ page, perPage }));
  }, [dispatch, page]);

  const handleNext = () => {
    if (page < data.totalPages) setPage((p) => p + 1);
  };
  const handlePrev = () => {
    if (page > 1) setPage((p) => p - 1);
  };
  const handleRefresh = () => {
    dispatch(listLogsFn({ page, perPage }));
  };

  // Filter Logic
  const filteredLogs = data?.activityLogs?.filter((log) => {
    const matchesSearch =
      log.details?.message?.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase());
    const matchesAction = selectedAction ? log.action === selectedAction : true;
    return matchesSearch && matchesAction;
  });

  // Stats Summary
  const totalLogs = data?.total || 0;
  const bookingLogs = data?.activityLogs?.filter((l) =>
    l.action.includes("BOOKING")
  ).length;
  const paymentLogs = data?.activityLogs?.filter((l) =>
    l.action.includes("PAYMENT")
  ).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Activity className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-semibold tracking-tight">
            Activity Logs
          </h2>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="dark:border-gray-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" /> Filters
              </Button>
            </DialogTrigger>
            <DialogContent className="dark:bg-gray-900">
              <DialogHeader>
                <DialogTitle>Filter Logs</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 mt-3">
                <Input
                  placeholder="Search by user or action..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <select
                  className="w-full border rounded-md p-2 dark:bg-gray-800 dark:text-gray-200"
                  value={selectedAction}
                  onChange={(e) => setSelectedAction(e.target.value)}
                >
                  <option value="">All Actions</option>
                  <option value="BOOKING_CREATED">BOOKING_CREATED</option>
                  <option value="PAYMENT_COMPLETED">PAYMENT_COMPLETED</option>
                </select>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="default" size="sm">
            <FileBarChart className="w-4 h-4 mr-2" /> Reports
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="dark:bg-gray-900 dark:border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {totalLogs}
            </p>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-900 dark:border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Booking Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-500">{bookingLogs}</p>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-900 dark:border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Payment Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-500">{paymentLogs}</p>
          </CardContent>
        </Card>
      </div>

      {/* Logs Table */}
      <Card className="shadow-sm border dark:border-gray-800 dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            System Activity Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="animate-spin w-6 h-6 text-primary" />
              <span className="ml-2 text-gray-600 dark:text-gray-300">
                Loading logs...
              </span>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-4">{error}</div>
          ) : filteredLogs?.length ? (
            <div className="rounded-md border dark:border-gray-800 overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50 dark:bg-gray-800">
                  <TableRow>
                    <TableHead className="w-12 text-center">#</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log, index) => (
                    <TableRow
                      key={log.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/70 transition"
                    >
                      <TableCell className="text-center text-gray-600 dark:text-gray-300">
                        {(page - 1) * perPage + index + 1}
                      </TableCell>
                      <TableCell className="flex items-center gap-2 text-gray-900 dark:text-gray-200">
                        <User className="w-4 h-4 text-gray-500" />
                        {log.details?.creatorName || "—"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="capitalize dark:border-gray-600"
                        >
                          {log.details.creatorRole || "—"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-blue-600 dark:text-blue-400">
                        {log.action.replaceAll("_", " ")}
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-400 max-w-xs truncate">
                        {log.details?.message || ""}
                      </TableCell>
                      <TableCell className="text-gray-500 dark:text-gray-400">
                        {new Date(log.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="dark:hover:bg-gray-800"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setViewLog(log)}>
                              View Details
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-10 text-center text-gray-500 dark:text-gray-400">
              No logs found.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {!loading && data?.totalPages > 1 && (
        <div className="flex justify-between items-center">
          <Button
            onClick={handlePrev}
            disabled={page === 1}
            variant="outline"
            className="dark:border-gray-700"
          >
            Previous
          </Button>
          <span className="text-gray-600 dark:text-gray-400 text-sm">
            Page {page} of {data.totalPages}
          </span>
          <Button
            onClick={handleNext}
            disabled={page === data.totalPages}
            variant="outline"
            className="dark:border-gray-700"
          >
            Next
          </Button>
        </div>
      )}

      {/* View Dialog */}
      {viewLog && (
        <Dialog open={!!viewLog} onOpenChange={() => setViewLog(null)}>
          <DialogContent className="dark:bg-gray-900">
            <DialogHeader>
              <DialogTitle>Log Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <p>
                <strong>User:</strong> {viewLog.details?.name}
              </p>
              <p>
                <strong>Role:</strong> {viewLog.details?.role}
              </p>
              <p>
                <strong>Action:</strong> {viewLog.action.replaceAll("_", " ")}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(viewLog.createdAt).toLocaleString()}
              </p>
              <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md overflow-auto text-xs">
                {JSON.stringify(viewLog.details, null, 2)}
              </pre>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ListAdminLogs;
