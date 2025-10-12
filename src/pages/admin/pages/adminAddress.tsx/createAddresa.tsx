"use client";

import type { AppDispatch, RootState } from "@/redux/store";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createAddressFn,
  resetCreateAddresstate,
} from "@/redux/slices/address/createAddress";
import { listofficersFn } from "@/redux/slices/officers/listOfficer";

import type { Officer } from "@/redux/types/user";
import type { FormikValues } from "formik";
import { Controller, useForm } from "react-hook-form";

const CreateAddress: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const createAddressState = useSelector(
    (state: RootState) => state.createAddressSlice
  );

  useEffect(() => {
    dispatch(listofficersFn({ page: 1, perPage: 100 }));
  }, [dispatch]);

  const { data: officersData } = useSelector(
    (state: RootState) => state.listofficersSlice
  );
  const officers: Officer[] = officersData?.officers || [];

  const user = useSelector((state: RootState) => state.loginSlice.data?.user);

  const { control, handleSubmit, reset } = useForm<FormikValues>({
    defaultValues: { address: "", officerId: "" },
  });

  const onSubmit = (values: FormikValues) => {
    if (!values.address || !values.officerId) {
      toast.error("Please fill all required fields.");
      return;
    }

    dispatch(
      createAddressFn({
        userId: user?.id,
        address: values.address,
        officerId: values.officerId,
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Address created successfully!");
        reset();
        navigate("/dashboard/admin/addresses");

        dispatch(resetCreateAddresstate());
      })
      .catch((err: string) => toast.error(err));
  };

  return (
    <div className="p-6">
      <Card className="mx-auto max-w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Create New Address
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Address */}
            <div className="space-y-1">
              <Label htmlFor="address">Address</Label>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="address"
                    placeholder="Enter address e.g: Berbera"
                  />
                )}
              />
            </div>

            {/* Officer */}
            <div>
              <Label htmlFor="officerId">Officer</Label>
              <Controller
                name="officerId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select officer" />
                    </SelectTrigger>
                    <SelectContent>
                      {officers.map((off) => (
                        <SelectItem key={off.id} value={off.id}>
                          {`${off.name.split(" ")[0]} (${off.phone})`}
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
              disabled={createAddressState.loading}
            >
              {createAddressState.loading ? "Creating..." : "Create address"}
            </Button>

            {createAddressState.error && (
              <p className="text-red-500 mt-2">{createAddressState.error}</p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateAddress;
