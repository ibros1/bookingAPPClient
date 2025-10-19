"use client";

import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import type { AppDispatch, RootState } from "@/redux/store";

import { createUser } from "@/redux/slices/userManagement/userManagement";
import { updateRoleFn } from "@/redux/slices/users/updateRole";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import { Eye, EyeOff, Settings, UserPlus } from "lucide-react";

import {
  ROLE_DESCRIPTIONS,
  ROLE_PERMISSIONS,
  USER_ROLES,
  type UserRole,
} from "@/constants/userRoles";
import { useNavigate } from "react-router-dom";

interface CreateUserFormData {
  name: string;
  email?: string;
  phone: string;
  password: string;
  confirmPassword: string;
  address?: string;
  role: UserRole;
  permissions: string[];
}

const permissionCategories = [
  {
    title: "User",
    permissions: ["MANAGE_USERS", "VIEW_USERS"],
    icon: Settings,
  },
  {
    title: "Bookings",
    permissions: ["CREATE_BOOKINGS", "MANAGE_BOOKINGS"],
    icon: Settings,
  },
  { title: "Reports", permissions: ["VIEW_REPORTS"], icon: Settings },
];

const CreateUser: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { createUserLoading } = useSelector(
    (state: RootState) => state.userManagementSlice
  );

  const { loading: updateRoleLoading } = useSelector(
    (state: RootState) => state.updateRoleSlice
  );

  const form = useForm<CreateUserFormData>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      address: "",
      role: "USER",
      permissions: ROLE_PERMISSIONS.USER,
    },
  });

  const [selectedRole, setSelectedRole] = useState<UserRole>("USER");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    ROLE_PERMISSIONS.USER
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /** Handle role change */
  const handleRoleChange = (roleValue: string) => {
    const role = roleValue as UserRole;
    setSelectedRole(role);

    const newPerms = ROLE_PERMISSIONS[role] || [];
    setSelectedPermissions(newPerms);

    form.setValue("role", role);
    form.setValue("permissions", newPerms);
  };

  /** Toggle permission manually */
  const handlePermissionToggle = (perm: string) => {
    const newPerms = selectedPermissions.includes(perm)
      ? selectedPermissions.filter((p) => p !== perm)
      : [...selectedPermissions, perm];
    setSelectedPermissions(newPerms);
    form.setValue("permissions", newPerms);
  };

  /** Create user submission */
  const onSubmit = async (data: CreateUserFormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await dispatch(createUser(data)).unwrap();
      toast.success("User created successfully!");
      navigate("/dashboard/admin/users");
      // If role is not default USER, trigger updateRole API
      if (data.role !== "USER") {
        const payload = { phone: data.phone, role: data.role };
        await dispatch(updateRoleFn(payload)).unwrap();
        toast.success(`Role updated to ${data.role}`);
      }

      form.reset();
      setSelectedRole("USER");
      setSelectedPermissions(ROLE_PERMISSIONS.USER);
    } catch (err) {
      toast.error(String(err));
    }
  };

  return (
    <div className="w-full p-6 text-gray-900 dark:text-white">
      <Card className="mx-auto max-w-full">
        <CardHeader>
          <div className="flex items-center gap-3">
            <UserPlus className="w-6 h-6 text-blue-600" />
            <CardTitle className="text-2xl font-bold">
              Create New User
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          <FormProvider {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              {/* BASIC INFO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter full name"
                    {...form.register("name", { required: "Name is required" })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    placeholder="Enter phone number"
                    {...form.register("phone", {
                      required: "Phone is required",
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email"
                    {...form.register("email")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    placeholder="Enter address"
                    {...form.register("address", {
                      required: "Address is required",
                    })}
                  />
                </div>
              </div>

              <Separator />

              {/* SECURITY */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      {...form.register("password", {
                        required: "Password is required",
                      })}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      {...form.register("confirmPassword", {
                        required: "Confirm password is required",
                      })}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* ROLE & PERMISSIONS */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>User Role *</Label>
                  <Select value={selectedRole} onValueChange={handleRoleChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {USER_ROLES.map((role) => (
                        <SelectItem key={role} value={role}>
                          <div className="flex flex-col">
                            <span className="font-medium">{role}</span>
                            <span className="text-xs text-gray-500">
                              {ROLE_DESCRIPTIONS[role]}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label>Permissions</Label>
                  <Badge variant="secondary">
                    {selectedPermissions.length} selected
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {permissionCategories.map((cat) => (
                    <div key={cat.title} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <cat.icon className="w-4 h-4 text-gray-500" />
                        <h4 className="font-medium text-sm">{cat.title}</h4>
                      </div>
                      <div className="space-y-2 pl-6">
                        {cat.permissions.map((perm) => (
                          <div
                            key={perm}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={perm}
                              checked={selectedPermissions.includes(perm)}
                              onCheckedChange={() =>
                                handlePermissionToggle(perm)
                              }
                            />
                            <Label
                              htmlFor={perm}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {perm.replace(/_/g, " ")}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setSelectedRole("USER");
                    setSelectedPermissions(ROLE_PERMISSIONS.USER);
                  }}
                >
                  Reset
                </Button>

                <Button
                  type="submit"
                  disabled={createUserLoading || updateRoleLoading}
                  className="min-w-[120px]"
                >
                  {createUserLoading || updateRoleLoading
                    ? "Processing..."
                    : "Create User"}
                </Button>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateUser;
