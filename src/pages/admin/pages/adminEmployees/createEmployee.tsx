"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import * as XLSX from "xlsx";

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

import type { AppDispatch, RootState } from "@/redux/store";
import type { FormikValues } from "formik";
import {
  createEmployeesFn,
  resetCreateEmployeestate,
} from "@/redux/slices/emplooyee/createEmployee";

const CreateEmployee: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"manual" | "excel">("manual");
  const [excelFile, setExcelFile] = useState<File | null>(null);

  const { control, handleSubmit, reset } = useForm<FormikValues>({
    defaultValues: {
      name: "",
      phone: "",
      sex: "",
      status: "",
      position: "",
      address: "",
      salary: 0,
      notes: "",
    },
  });

  const createEmployeeState = useSelector(
    (state: RootState) => state.createEmployeesSlice
  );
  const user = useSelector((state: RootState) => state.loginSlice.data?.user);

  // Manual form submit
  const onSubmit = (values: FormikValues) => {
    if (!values.name || !values.phone || !values.sex || !values.status) {
      toast.error("Please fill all required fields.");
      return;
    }
    const salaryAmount = parseFloat(values.salary);

    dispatch(
      createEmployeesFn([
        {
          name: values.name,
          phone: values.phone,
          sex: values.sex,
          status: values.status,
          position: values.position,
          address: values.address,
          salary: salaryAmount,
          notes: values.notes,
          userId: user?.id,
        },
      ])
    )
      .unwrap()
      .then(() => {
        toast.success("Employee created successfully!");
        reset();
        navigate("/dashboard/admin/employees");
        dispatch(resetCreateEmployeestate());
      })
      .catch((err: string) => toast.error(err));
  };

  // Excel file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setExcelFile(file || null);
  };

  // Excel submit
  const handleExcelSubmit = () => {
    if (!excelFile) {
      toast.error("Please select an Excel file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData: any[] = XLSX.utils.sheet_to_json(sheet);

      if (!jsonData || jsonData.length === 0) {
        toast.error("Excel sheet is empty or invalid.");
        return;
      }

      const employees = jsonData
        .map((row) => ({
          name: row["Name"],
          phone: String(row["Phone"]),
          sex: row["Sex"]?.toLowerCase(),
          status: row["Status"]?.toLowerCase(),
          position: row["Position"],
          address: row["Address"],
          salary: parseFloat(row["Salary"]),
          notes: row["Notes"],
          userId: user?.id,
        }))
        .filter(
          (emp) =>
            emp.name &&
            emp.phone &&
            !isNaN(emp.salary) &&
            ["male", "female"].includes(emp.sex) &&
            ["active", "inactive"].includes(emp.status)
        );

      if (employees.length === 0) {
        toast.error("No valid employee data found in Excel.");
        return;
      }

      const toastId = toast.loading("Uploading employees...");
      dispatch(createEmployeesFn(employees))
        .unwrap()
        .then(() => {
          toast.success("Employees uploaded successfully!", { id: toastId });
          navigate("/dashboard/admin/employees");
          dispatch(resetCreateEmployeestate());
        })
        .catch((err: string) =>
          toast.error(`Failed to upload: ${err}`, { id: toastId })
        );
    };
    reader.readAsArrayBuffer(excelFile);
  };

  return (
    <div className="p-6">
      <Card className="mx-auto max-w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Create New Employee
          </CardTitle>
          <div className="flex gap-4 mt-4">
            <Button
              variant={mode === "manual" ? "default" : "outline"}
              onClick={() => setMode("manual")}
            >
              Manual Entry
            </Button>
            <Button
              variant={mode === "excel" ? "default" : "outline"}
              onClick={() => setMode("excel")}
            >
              Upload Excel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {mode === "manual" ? (
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {/* Name */}
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="name"
                      placeholder="Enter employee name"
                    />
                  )}
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <Label htmlFor="phone">Phone</Label>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="phone"
                      placeholder="Enter phone number"
                    />
                  )}
                />
              </div>

              {/* Sex */}
              <div>
                <Label htmlFor="sex">Sex</Label>
                <Controller
                  name="sex"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sex" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Status */}
              <div>
                <Label htmlFor="status">Status</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Position */}
              <div className="space-y-1">
                <Label htmlFor="position">Position</Label>
                <Controller
                  name="position"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="position"
                      placeholder="Enter position"
                    />
                  )}
                />
              </div>

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
                      placeholder="Enter address"
                    />
                  )}
                />
              </div>

              {/* Salary */}
              <div className="space-y-1">
                <Label htmlFor="salary">Salary</Label>
                <Controller
                  name="salary"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="salary"
                      type="number"
                      placeholder="Enter salary"
                    />
                  )}
                />
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <Label htmlFor="notes">Notes</Label>
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} id="notes" placeholder="Enter notes" />
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={createEmployeeState.loading}
              >
                {createEmployeeState.loading
                  ? "Creating..."
                  : "Create Employee"}
              </Button>

              {createEmployeeState.error && (
                <p className="text-red-500 mt-2">{createEmployeeState.error}</p>
              )}
            </form>
          ) : (
            <div className="space-y-4">
              <Label htmlFor="file">Upload Excel File</Label>
              <Input
                id="file"
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
              />
              <p className="text-sm text-gray-500">
                Excel must have columns:{" "}
                <b>
                  Name, Phone, Sex, Status, Position, Address, Salary, Notes
                </b>
              </p>
              <Button
                onClick={handleExcelSubmit}
                disabled={createEmployeeState.loading || !excelFile}
              >
                {createEmployeeState.loading
                  ? "Uploading..."
                  : "Upload Employees"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateEmployee;
