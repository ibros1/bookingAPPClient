import { getOneMessageFn } from "@/redux/slices/messages/getOneMessage";
import type { AppDispatch, RootState } from "@/redux/store";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  CheckCircle2,
  Clock4,
  User,
  Phone,
  ArrowLeft,
  Copy,
} from "lucide-react";
import LoadingPages from "@/components/loading";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

const MessageDetailedPage = () => {
  const { messageId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const messageState = useSelector(
    (state: RootState) => state.getOneMessageSlice
  );
  const message = messageState.data?.data;

  const [tab, setTab] = useState<"recipients" | "extraNumbers">("recipients");

  useEffect(() => {
    if (messageId) dispatch(getOneMessageFn(messageId));
  }, [dispatch, messageId]);

  if (messageState.loading) return <LoadingPages message="Loading..." />;

  if (!message) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          No messages found!
        </p>
      </div>
    );
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2 mb-2"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      {/* Message Header */}
      <Card className="hover:shadow-sm transition-shadow">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center justify-between">
            Message Details
            <Badge variant="outline" className="text-xs">
              {message._count.recipients} Recipients •{" "}
              {message._count.extraNumbers} Extra Numbers
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-700 dark:text-gray-300">
              Message
            </h3>
            <p className="mt-1 text-lg">{message.message}</p>
          </div>

          <div>
            <h3 className="font-medium text-gray-700 dark:text-gray-300">
              Created At
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {format(new Date(message.createdAt), "PPpp")}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Creator Info */}
      <Card className="hover:shadow-sm transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Created By</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback>
              {message.creator.name?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-base font-medium">{message.creator.name}</p>
            <p className="text-sm text-gray-500">
              {message.creator.email || "No email"}
            </p>
            <p className="text-sm text-gray-500">
              {message.creator.phone || "No phone"}
            </p>
            <Badge variant="secondary" className="mt-1">
              {message.creator.role}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2">
        <Button
          variant={tab === "recipients" ? "default" : "outline"}
          onClick={() => setTab("recipients")}
        >
          Recipients ({message._count.recipients})
        </Button>
        <Button
          variant={tab === "extraNumbers" ? "default" : "outline"}
          onClick={() => setTab("extraNumbers")}
        >
          Extra Numbers ({message._count.extraNumbers})
        </Button>
      </div>

      {/* Recipients / Extra Numbers List */}
      {tab === "recipients" ? (
        <Card className="hover:shadow-sm transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recipients</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {message.recipients.length > 0 ? (
              message.recipients.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-muted/40 hover:bg-muted/60 transition"
                >
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{r.phone}</p>
                      {r.scheduledAt && (
                        <p className="text-xs text-gray-500">
                          Scheduled: {format(new Date(r.scheduledAt), "PPpp")}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {r.sent ? (
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 px-2 py-1"
                      >
                        <CheckCircle2 className="h-4 w-4" /> Sent
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 px-2 py-1"
                      >
                        <Clock4 className="h-4 w-4" /> Pending
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(r.phone)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No recipients found.</p>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="hover:shadow-sm transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Extra Numbers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {message.extraNumbers.length > 0 ? (
              message.extraNumbers.map((ex) => (
                <div
                  key={ex.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-muted/40 hover:bg-muted/60 transition"
                >
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        {ex.name || "Unnamed Contact"}
                      </p>
                      <p className="text-sm text-gray-500">{ex.phone}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(ex.phone)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No extra numbers found.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MessageDetailedPage;
