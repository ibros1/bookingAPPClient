"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";

import { listAddressFn } from "@/redux/slices/address/listAddress";
import { listBookersFn } from "@/redux/slices/bookers/listBookers";

import type { AppDispatch, RootState } from "@/redux/store";
import type { FormikValues } from "formik";
import {
  createHotelsFn,
  resetCreateHotelstate,
} from "@/redux/slices/hotels/createHotel";

const CreateHotel: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { control, handleSubmit, reset } = useForm<FormikValues>({
    defaultValues: { name: "", addressId: "", bookerId: "" },
  });

  const { data: addressesData } = useSelector(
    (state: RootState) => state.listAddressSlice
  );
  const { data: bookersData } = useSelector(
    (state: RootState) => state.listBookersSlice
  );
  const createHotelState = useSelector(
    (state: RootState) => state.createHotelsSlice
  );

  const addresses = addressesData?.address || [];
  const bookers = bookersData?.bookers || [];
  const user = useSelector((state: RootState) => state.loginSlice.data?.user);

  useEffect(() => {
    dispatch(listAddressFn({ page: 1, perPage: 100 }));
    dispatch(listBookersFn({ page: 1, perPage: 100 }));
  }, [dispatch]);

  const onSubmit = (values: FormikValues) => {
    if (!values.name || !values.addressId || !values.bookerId) {
      toast.error("Please fill all required fields.");
      return;
    }

    dispatch(
      createHotelsFn({
        name: values.name,
        addressId: values.addressId,
        bookerId: values.bookerId,
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Hotel created successfully!");
        reset();
        navigate("/dashboard/admin/hotels");
        dispatch(resetCreateHotelstate());
      })
      .catch((err: string) => toast.error(err));
  };

  return (
    <div className="p-6">
      <Card className="mx-auto max-w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create New Hotel</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Hotel Name */}
            <div className="space-y-1">
              <Label htmlFor="name">Hotel Name</Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input {...field} id="name" placeholder="Enter hotel name" />
                )}
              />
            </div>

            {/* Address */}
            <div>
              <Label htmlFor="addressId">Address</Label>
              <Controller
                name="addressId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select address" />
                    </SelectTrigger>
                    <SelectContent>
                      {addresses.map((addr) => (
                        <SelectItem key={addr.id} value={addr.id}>
                          {addr.address}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Booker */}
            <div>
              <Label htmlFor="bookerId">Booker</Label>
              <Controller
                name="bookerId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select booker" />
                    </SelectTrigger>
                    <SelectContent>
                      {bookers.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          {`${b.name.split(" ")[0]} (${b.phone})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={createHotelState.loading}
            >
              {createHotelState.loading ? "Creating..." : "Create Hotel"}
            </Button>

            {createHotelState.error && (
              <p className="text-red-500 mt-2">{createHotelState.error}</p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateHotel;
