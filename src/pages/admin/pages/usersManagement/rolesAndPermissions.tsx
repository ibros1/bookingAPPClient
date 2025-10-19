"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Shield, Edit } from "lucide-react";

import { listUsersFn } from "@/redux/slices/users/getAllUsers";
import {
  updateRoleFn,
  resetUpdatedRoleState,
} from "@/redux/slices/users/updateRole";

import type { UserRole, Permission, User } from "@/redux/types/userManagement";
import { UserRole as UserRoleEnum } from "@/redux/types/userManagement";

// Mock permission categories for UI design only
const permissionCategories = [
  {
    title: "User Management",
    icon: Shield,
    permissions: ["CREATE_USER", "READ_USER", "UPDATE_USER", "DELETE_USER"],
  },
  {
    title: "Booking Management",
    icon: Shield,
    permissions: [
      "CREATE_BOOKING",
      "READ_BOOKING",
      "UPDATE_BOOKING",
      "DELETE_BOOKING",
    ],
  },
  {
    title: "Reports",
    icon: Shield,
    permissions: ["VIEW_REPORTS", "EXPORT_REPORTS"],
  },
];

const RolesAndPermissions: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Redux state
  const { users, loading } = useSelector((state: RootState) => ({
    users: (state.listUsersSlice.data.users || []) as unknown as User[],
    loading: state.listUsersSlice.loading,
  }));
  const { loading: updateRoleLoading } = useSelector(
    (state: RootState) => state.updateRoleSlice
  );

  // Local state
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | "">("");
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>(
    []
  );

  // Fetch users on mount
  useEffect(() => {
    dispatch(listUsersFn({ page: 1, perPage: 100 }));
  }, [dispatch]);

  // Handlers
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setSelectedRole(user.role);
    setSelectedPermissions(user.permissions || []);
    setEditDialogOpen(true);
  };

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    // For mock design only: automatically select permissions for that role
    setSelectedPermissions(
      permissionCategories.flatMap((cat) => cat.permissions) as Permission[]
    );
  };

  const handlePermissionToggle = (permission: Permission) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

  const handleSaveChanges = async () => {
    if (!editingUser || !selectedRole) return;

    try {
      await dispatch(
        updateRoleFn({ phone: editingUser.phone, role: selectedRole })
      ).unwrap();
      toast.success("User role updated successfully!");
      setEditDialogOpen(false);
      setEditingUser(null);
      dispatch(resetUpdatedRoleState());
      dispatch(listUsersFn({ page: 1, perPage: 100 }));
    } catch (error) {
      toast.error(error as string);
    }
  };

  // Filter users
  const filteredUsers = users.filter(
    (user) =>
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm) ||
        (user.email &&
          user.email.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      (selectedRole === "" || user.role === selectedRole)
  );

  // Helpers
  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case UserRoleEnum.ADMIN:
        return "destructive";
      case UserRoleEnum.OFFICER:
        return "default";
      case UserRoleEnum.BOOKER:
        return "secondary";
      case UserRoleEnum.USER:
        return "outline";
      default:
        return "outline";
    }
  };

  const getRolePermissionCount = () => selectedPermissions.length;

  if (loading) {
    return (
      <div className="w-full min-h-screen p-6 flex items-center justify-center text-lg text-gray-900 dark:text-white">
        Loading users...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen p-6 text-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Roles & Permissions</h1>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedRole === "" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRole("")}
              >
                All Roles
              </Button>
              {Object.values(UserRoleEnum).map((role) => (
                <Button
                  key={role}
                  variant={selectedRole === role ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedRole(role)}
                >
                  {role}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>User Roles & Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>{user.email || "-"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={getRoleBadgeVariant(user.role as UserRole)}
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {(user as User).permissions?.length || 0} permissions
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? "default" : "secondary"}>
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditUser(user as User)}
                        disabled={updateRoleLoading}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit User Role & Permissions</DialogTitle>
              <DialogDescription>
                {editingUser ? `Manage ${editingUser.name}` : ""}
              </DialogDescription>
            </DialogHeader>

            {editingUser && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <h3 className="font-semibold">{editingUser.name}</h3>
                    <p className="text-sm text-gray-500">{editingUser.phone}</p>
                  </div>
                  <Badge
                    variant={getRoleBadgeVariant(selectedRole as UserRole)}
                  >
                    {selectedRole}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <Label>Role</Label>
                  <div className="flex gap-2 flex-wrap">
                    {Object.values(UserRoleEnum).map((role) => (
                      <Button
                        key={role}
                        variant={selectedRole === role ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleRoleChange(role)}
                      >
                        {role}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Permissions (UI only)</Label>
                    <Badge variant="secondary">
                      {getRolePermissionCount()} selected
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {permissionCategories.map((category) => (
                      <div key={category.title} className="space-y-3">
                        <div className="flex items-center gap-2">
                          <category.icon className="w-4 h-4 text-gray-500" />
                          <h4 className="font-medium text-sm">
                            {category.title}
                          </h4>
                        </div>
                        <div className="space-y-2 pl-6">
                          {category.permissions.map((permission) => (
                            <div
                              key={permission}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`${editingUser.id}-${permission}`}
                                checked={selectedPermissions.includes(
                                  permission as Permission
                                )}
                                onCheckedChange={() =>
                                  handlePermissionToggle(
                                    permission as Permission
                                  )
                                }
                              />
                              <Label
                                htmlFor={`${editingUser.id}-${permission}`}
                                className="text-sm font-normal cursor-pointer"
                              >
                                {permission.replace(/_/g, " ")}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveChanges} disabled={updateRoleLoading}>
                {updateRoleLoading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default RolesAndPermissions;
