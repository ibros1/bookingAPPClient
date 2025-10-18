import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Phone,
  CalendarDays,
  DollarSign,
  User,
  Ticket,
  ArrowLeft,
  Copy,
  CheckCircle2,
  FileDown,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { getOneBookingDetailFn } from "@/redux/slices/bookings/getDetailBooking";
import toast, { Toaster } from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function BookingDetail() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [copied, setCopied] = useState(false);

  const { data, loading, error } = useSelector(
    (state: RootState) => state.getOneBookingDetailSlice
  );

  useEffect(() => {
    dispatch(getOneBookingDetailFn(bookingId!));
  }, [bookingId, dispatch]);

  const booking = data?.booking;

  const handleCopyId = async () => {
    if (booking?.id) {
      await navigator.clipboard.writeText(booking.id);
      setCopied(true);
      toast.success("Booking ID copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  /** ✅ New Downloadable PDF Generator */
  const handleExportPDF = () => {
    if (!booking) return;

    // 👇 Fix typing for lastAutoTable
    const doc = new jsPDF() as jsPDF & { lastAutoTable?: { finalY: number } };
    doc.setFont("helvetica", "normal");

    // Title
    doc.setFontSize(18);
    doc.text("Booking Details", 14, 20);

    doc.setFontSize(12);
    doc.text(`Booking ID: ${booking.id}`, 14, 30);
    doc.text(
      `Created At: ${new Date(booking.createdAt).toLocaleString()}`,
      14,
      38
    );

    // Summary table
    autoTable(doc, {
      startY: 50,
      head: [["Field", "Value"]],
      body: [
        ["Name", booking.name],
        ["Phone", booking.phoneNumber],
        ["Route", `${booking.ride.route.from} to ${booking.ride.route.end}`],
        ["Tickets", booking.qty],
        [
          "Total Amount",
          `${booking.total_amount.toLocaleString()} ${booking.currency}`,
        ],
        ["Payment Type", booking.paymentType],
      ],
      styles: { fontSize: 11, cellPadding: 3 },
      headStyles: { fillColor: [66, 66, 66] },
    });

    // Booker Info table
    autoTable(doc, {
      startY: (doc.lastAutoTable?.finalY ?? 60) + 10,
      head: [["Booker Info", ""]],
      body: [
        ["Name", booking.booker.name],
        ["Email", booking.booker.email || "No email"],
        ["Phone", booking.booker.phone || "N/A"],
        ["Address", booking.booker.address || "N/A"],
      ],
      styles: { fontSize: 11, cellPadding: 3 },
      headStyles: { fillColor: [66, 66, 66] },
    });

    // Footer
    doc.setFontSize(10);
    doc.text("Generated Booking System", 14, doc.internal.pageSize.height - 10);

    // Save PDF
    doc.save(`booking_${booking.id}.pdf`);
  };

  // Loading state
  if (loading)
    return (
      <div className="w-full mx-auto px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );

  // Error / Not Found
  if (error || !booking)
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-muted-foreground">{error || "Booking not found."}</p>
        <Button variant="outline" onClick={() => navigate(-1)} className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
        </Button>
      </div>
    );

  // Success render
  return (
    <div className="w-full mx-auto px-8 py-8 space-y-6">
      <Toaster />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Booking Details
          </h1>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              ID: {booking.id.slice(0, 8)}...
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={handleCopyId}
            >
              {copied ? (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 text-muted-foreground" />
              )}
            </Button>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportPDF}>
            <FileDown className="w-4 h-4 mr-2" /> Export PDF
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
        </div>
      </div>

      {/* Summary */}
      <Card className="shadow-sm border">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-base">Booking Summary</CardTitle>
          <Badge
            variant={
              booking.paymentType === "cash"
                ? "secondary"
                : booking.paymentType === "online"
                ? "default"
                : "outline"
            }
          >
            {booking.paymentType.toUpperCase()}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">{booking.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{booking.phoneNumber}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                {booking.ride.route.from} → {booking.ride.route.end}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                {new Date(booking.createdAt).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Tickets</span>
              <span className="text-sm font-medium flex items-center gap-1">
                <Ticket className="w-4 h-4" /> {booking.qty}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">
                Total Amount
              </span>
              <span className="text-sm font-medium flex items-center gap-1">
                <DollarSign className="w-4 h-4" />{" "}
                {booking.total_amount.toLocaleString()} {booking.currency}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">
                Payment Type
              </span>
              <Badge variant="secondary" className="w-fit mt-1">
                {booking.paymentType}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booker Info */}
      <Card className="shadow-sm border">
        <CardHeader>
          <CardTitle className="text-base">Booker Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            {booking.booker.profilePhoto ? (
              <img
                src={booking.booker.profilePhoto}
                alt={booking.booker.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
            )}
            <div>
              <p className="font-medium text-sm">{booking.booker.name}</p>
              <p className="text-xs text-muted-foreground">
                {booking.booker.email || "No email provided"}
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Phone: {booking.booker.phone}
          </p>
          <p className="text-sm text-muted-foreground">
            Address: {booking.booker.address ? booking.booker.address : "N/A"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
