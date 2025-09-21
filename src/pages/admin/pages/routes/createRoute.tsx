"use client";

import type { AppDispatch, RootState } from "@/redux/store";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { BASE_API_URL } from "@/constants/base_url";
import {
  createRoutesFn,
  resetCreateRouteState,
} from "@/redux/slices/routes/createRoutes";

const CreateRoute: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const createRouteState = useSelector(
    (state: RootState) => state.createRoutesSlice
  );

  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");

  const user = useSelector((state: RootState) => state.loginSlice.data?.user);
  // Fetch drivers
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const res = await fetch(`${BASE_API_URL}/users/all`);
        const data = await res.json();
        data.users.filter((user: any) => user.role === "DRIVER");
      } catch (err) {
        console.error("Failed to fetch drivers:", err);
      }
    };
    fetchDrivers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startLocation || !endLocation) {
      toast.error("Please fill all required fields.");
      return;
    }

    dispatch(
      createRoutesFn({
        userId: user.id,
        from: startLocation, // your backend expects `from` as the route name
        end: endLocation,
      })
    )
      .unwrap()
      .then((res) => {
        toast.success(res.message || "Route created successfully!");

        setStartLocation("");
        setEndLocation("");

        navigate("/dashboard/admin/routes");
        dispatch(resetCreateRouteState());
      })
      .catch((err: string) => toast.error(err));
  };

  return (
    <div className="p-6">
      <Card className="mx-auto max-w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create New Route</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Start Location */}
            <div className="space-y-1">
              <Label htmlFor="startLocation">Start Location</Label>
              <Input
                id="startLocation"
                placeholder="Enter start location"
                value={startLocation}
                onChange={(e) => setStartLocation(e.target.value)}
              />
            </div>

            {/* End Location */}
            <div className="space-y-1">
              <Label htmlFor="endLocation">End Location</Label>
              <Input
                id="endLocation"
                placeholder="Enter end location"
                value={endLocation}
                onChange={(e) => setEndLocation(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={createRouteState.loading}
            >
              {createRouteState.loading ? "Creating..." : "Create Route"}
            </Button>

            {createRouteState.error && (
              <p className="text-red-500 mt-2">{createRouteState.error}</p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateRoute;
