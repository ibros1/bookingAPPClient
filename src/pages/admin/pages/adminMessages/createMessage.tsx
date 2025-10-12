"use client";

import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import type { AppDispatch, RootState } from "@/redux/store";
import type { FormikValues } from "formik";

import {
  createMessagesFn,
  resetCreateMessagestate,
} from "@/redux/slices/messages/sendMessage";
import { listEmployeesFn } from "@/redux/slices/emplooyee/listEmplooyee";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";

const CreateMessage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { control, watch, setValue, reset } = useForm<FormikValues>({
    defaultValues: {
      employeeIds: [] as string[],
      extraNumbers: [] as { phone: string; name?: string }[],
      scheduledAt: "",
    },
  });

  const userState = useSelector((state: RootState) => state.loginSlice);
  const createMessageState = useSelector(
    (state: RootState) => state.createMessagesSlice
  );
  const employeeState = useSelector(
    (state: RootState) => state.listEmployeesSlice
  );

  const selectedEmployees: string[] = watch("employeeIds");
  const extraNumbers: { phone: string; name?: string }[] =
    watch("extraNumbers");
  const scheduledAt: string = watch("scheduledAt");

  const [search, setSearch] = useState("");
  const [extraPhoneInput, setExtraPhoneInput] = useState("");
  const [extraNameInput, setExtraNameInput] = useState("");

  // Fetch all employees at once
  useEffect(() => {
    dispatch(listEmployeesFn({ page: 1, limit: 10000 })); // high limit for all employees
  }, [dispatch]);

  // TipTap editor setup
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: "",
  });

  // WhatsApp-safe formatting
  const convertToWhatsAppFormat = (html: string) => {
    const text = html
      .replace(/&nbsp;/g, " ")
      .replace(/<p>(.*?)<\/p>/g, "$1\n")
      .replace(/<br\s*\/?>/g, "\n")
      .replace(/<strong>(.*?)<\/strong>/g, "*$1*")
      .replace(/<b>(.*?)<\/b>/g, "*$1*")
      .replace(/<em>(.*?)<\/em>/g, "_$1_")
      .replace(/<i>(.*?)<\/i>/g, "_$1_")
      .replace(/<u>(.*?)<\/u>/g, "_$1_")
      .replace(/<s>(.*?)<\/s>/g, "~$1~")
      .replace(/<del>(.*?)<\/del>/g, "~$1~")
      .replace(/<code>(.*?)<\/code>/g, "`$1`")
      .replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, "```\n$1\n```")
      .replace(/<\/?[^>]+(>|$)/g, "")
      .split("\n")
      .map((line) => line.trimEnd())
      .join("\n");
    return text;
  };

  // Toggle select all employees
  const toggleSelectAll = () => {
    if (selectedEmployees.length === employeeState.data?.employee?.length) {
      setValue("employeeIds", []);
    } else {
      setValue(
        "employeeIds",
        employeeState.data?.employee.map((emp) => emp.id) || []
      );
    }
  };

  const toggleEmployee = (id: string) => {
    if (selectedEmployees.includes(id)) {
      setValue(
        "employeeIds",
        selectedEmployees.filter((empId) => empId !== id)
      );
    } else {
      setValue("employeeIds", [...selectedEmployees, id]);
    }
  };

  const removeEmployee = (id: string) => {
    setValue(
      "employeeIds",
      selectedEmployees.filter((empId) => empId !== id)
    );
  };

  // Extra numbers logic
  const addExtraNumber = () => {
    if (!extraPhoneInput.trim()) return;
    if (!extraNumbers.some((num) => num.phone === extraPhoneInput.trim())) {
      setValue("extraNumbers", [
        ...extraNumbers,
        {
          phone: extraPhoneInput.trim(),
          name: extraNameInput.trim() || undefined,
        },
      ]);
      setExtraPhoneInput("");
      setExtraNameInput("");
    }
  };

  const removeExtraNumber = (phone: string) => {
    setValue(
      "extraNumbers",
      extraNumbers.filter((num) => num.phone !== phone)
    );
  };

  // Filter employees
  const filteredEmployees = useMemo(() => {
    return employeeState.data?.employee?.filter(
      (emp) =>
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.phone.includes(search)
    );
  }, [employeeState.data?.employee, search]);

  // Form submit
  const onSubmit = () => {
    if (!editor?.getHTML()) return toast.error("Message is required.");
    if (selectedEmployees.length === 0 && extraNumbers.length === 0)
      return toast.error("Please provide at least one recipient.");
    if (scheduledAt && new Date(scheduledAt) <= new Date())
      return toast.error("Scheduled time must be in the future.");

    const formattedMessage = convertToWhatsAppFormat(editor.getHTML());

    dispatch(
      createMessagesFn({
        message: formattedMessage,
        userId: userState.data?.user.id,
        employeeIds: selectedEmployees,
        extraNumbers,
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Message sent successfully!");
        reset();
        editor?.commands.setContent("");
        dispatch(resetCreateMessagestate());
        navigate("/dashboard/admin/messages");
      })
      .catch((err: string) => toast.error(err));
  };

  return (
    <div className="p-6">
      <Card className="mx-auto max-w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Create New Message
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
          >
            {/* Message Editor */}
            <div className="space-y-1">
              <Label>Message</Label>
              <div className="border rounded h-full">
                <EditorContent editor={editor} className="h-full p-2" />
              </div>
            </div>

            {/* Schedule */}
            <div className="space-y-1">
              <Label htmlFor="scheduledAt">Schedule (optional)</Label>
              <Controller
                name="scheduledAt"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="scheduledAt"
                    type="datetime-local"
                    value={scheduledAt}
                  />
                )}
              />
            </div>

            {/* Employee Recipients */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Recipients (Employees)</Label>
                <Button type="button" size="sm" onClick={toggleSelectAll}>
                  {selectedEmployees?.length ===
                  employeeState.data?.employee?.length
                    ? "Deselect All"
                    : "Select All"}
                </Button>
              </div>

              <Input
                placeholder="Search by name or phone"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <div className="max-h-48 overflow-y-auto border rounded p-2">
                {employeeState.loading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-6 w-full" />
                    ))}
                  </div>
                ) : filteredEmployees?.length > 0 ? (
                  filteredEmployees.map((emp) => (
                    <div
                      key={emp.id}
                      className="flex items-center justify-between px-2 py-1 hover:bg-gray-100 rounded cursor-pointer"
                      onClick={() => toggleEmployee(emp.id)}
                    >
                      <span>
                        {emp.name} ({emp.phone})
                      </span>
                      <input
                        type="checkbox"
                        checked={selectedEmployees.includes(emp.id)}
                        readOnly
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center">
                    No employees found
                  </p>
                )}
              </div>

              {selectedEmployees.length > 0 && (
                <div className="mt-4 space-y-2">
                  <Label>Selected Employees</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedEmployees.map((id) => {
                      const emp = employeeState.data?.employee.find(
                        (e) => e.id === id
                      );
                      if (!emp) return null;
                      return (
                        <div
                          key={id}
                          className="flex items-center gap-2 bg-gray-200 rounded-full px-3 py-1"
                        >
                          <span>{emp.name}</span>
                          <button
                            type="button"
                            onClick={() => removeEmployee(id)}
                            className="text-red-500 font-bold"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Extra Numbers */}
            <div className="space-y-3">
              <Label>Add Extra Phone Numbers</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Phone number"
                  value={extraPhoneInput}
                  onChange={(e) => setExtraPhoneInput(e.target.value)}
                />
                <Input
                  placeholder="Name (optional)"
                  value={extraNameInput}
                  onChange={(e) => setExtraNameInput(e.target.value)}
                />
                <Button type="button" onClick={addExtraNumber}>
                  Add
                </Button>
              </div>

              {extraNumbers.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {extraNumbers.map((num) => (
                    <div
                      key={num.phone}
                      className="flex items-center gap-2 bg-gray-200 rounded-full px-3 py-1"
                    >
                      <span>
                        {num.name ? `${num.name} (${num.phone})` : num.phone}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeExtraNumber(num.phone)}
                        className="text-red-500 font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={createMessageState.loading}
            >
              {createMessageState.loading ? "Sending..." : "Send Message"}
            </Button>

            {createMessageState.error && (
              <p className="text-red-500 mt-2">{createMessageState.error}</p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateMessage;
