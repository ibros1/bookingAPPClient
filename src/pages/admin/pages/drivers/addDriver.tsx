"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import {
  registerDriverFn,
  resetRegisterDriverState,
} from "@/redux/slices/drivers/createDriver";
import { useNavigate } from "react-router-dom";

const AddDriver: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("DRIVER");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };
  const dispatch = useDispatch<AppDispatch>();
  const createDriverState = useSelector(
    (state: RootState) => state.registerDriverSlice
  );

  useEffect(() => {
    if (createDriverState.error) {
      toast.dismiss();
      toast.error(createDriverState.error);
      return;
    }
    if (createDriverState.loading) {
      toast.loading("Adding new driver....");
      return;
    }

    if (createDriverState.data.isSuccess) {
      toast.dismiss();
      toast.success("Driver added successfully!");
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setRole("DRIVER");
      setProfilePhoto(null);
      setPreview(null);
      navigate("/dashboard/admin/drivers", { state: { refresh: true } });

      dispatch(resetRegisterDriverState());
    }
  }, [createDriverState, dispatch, navigate]);

  const handleRemovePhoto = () => {
    setProfilePhoto(null);
    setPreview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !phone) {
      toast.error("Please fill in all fields!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("role", "DRIVER");
    formData.append("password", password);
    formData.append("confirmPassword", password);
    formData.append("isActive", "true");

    if (profilePhoto) {
      formData.append("profilePhoto", profilePhoto);
    }

    dispatch(registerDriverFn(formData));
  };

  return (
    <div className="p-6 flex justify-center">
      <Card className="w-full max-w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Add New Driver</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter driver's name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter driver's email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter driver's phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create driver's password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="profilePhoto">Profile Photo</Label>
              <Input
                id="profilePhoto"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {preview && (
                <div className="flex items-center gap-3 mt-2">
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-20 w-20 object-cover rounded-full border"
                  />
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="text-red-600 hover:text-red-800 -mt-14 bg-white border cursor-pointer rounded-full -ml-8"
                    title="Remove photo"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRIVER">Driver</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full mt-2 cursor-pointer">
              Add Driver
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddDriver;
