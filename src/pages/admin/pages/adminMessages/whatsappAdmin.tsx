import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { BASE_API_URL } from "@/constants/base_url";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function WhatsAppAdminPage() {
  const token = useSelector((s: RootState) => s.loginSlice.data?.token);
  const isAdmin = useSelector(
    (s: RootState) => s.loginSlice.data?.user?.role === "ADMIN"
  );

  const api = useMemo(() => {
    const inst = axios.create({ baseURL: BASE_API_URL });
    inst.interceptors.request.use((cfg) => {
      if (token) cfg.headers.Authorization = `Bearer ${token}`;
      return cfg;
    });
    return inst;
  }, [token]);

  const [connected, setConnected] = useState<boolean>(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | undefined>();
  const [qrString, setQrString] = useState<string | undefined>();
  const [sending, setSending] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [numbers, setNumbers] = useState("");
  const [message, setMessage] = useState("");
  const [polling, setPolling] = useState(false);
  const [lastConnectedJid, setLastConnectedJid] = useState<
    string | undefined
  >();

  const fetchStatus = useCallback(async () => {
    try {
      const res = await api.get("/messages/whatsapp/status");
      setConnected(!!res.data.connected);
      setQrDataUrl(res.data.qrDataUrl);
      setQrString(res.data.qrString);
      setLastConnectedJid(res.data.lastConnectedJid);
    } catch (e: any) {
      // silent
    }
  }, [api]);

  const startConnect = useCallback(async () => {
    try {
      if (connecting) return;
      setConnecting(true);
      toast.loading("Starting WhatsApp session...", { id: "wa-connect" });
      const res = await api.post("/messages/whatsapp/connect");
      setConnected(!!res.data.connected);
      setQrDataUrl(res.data.qrDataUrl);
      setQrString(res.data.qrString);
      setLastConnectedJid(res.data.lastConnectedJid);
      toast.success("WhatsApp session started", { id: "wa-connect" });
      setPolling(true);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to start session", {
        id: "wa-connect",
      });
    } finally {
      setConnecting(false);
    }
  }, [api, connecting]);

  // Poll status while not connected
  useEffect(() => {
    let t: any;
    if (polling && !connected) {
      fetchStatus();
      t = setInterval(() => {
        fetchStatus();
      }, 2500);
    }
    return () => t && clearInterval(t);
  }, [polling, connected, fetchStatus]);

  const onSend = async () => {
    const list = numbers
      .split(/[,\n]/)
      .map((n) => n.trim())
      .filter(Boolean);
    if (list.length === 0 || !message.trim()) {
      toast.error("Add at least one number and a message");
      return;
    }
    try {
      setSending(true);
      await api.post("/messages/whatsapp/send", { numbers: list, message });
      toast.success("Message sent");
      setMessage("");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to send");
    } finally {
      setSending(false);
    }
  };

  const onReset = async () => {
    try {
      toast.loading("Resetting session...", { id: "wa-reset" });
      const res = await api.post("/messages/whatsapp/reset");
      setConnected(!!res.data.connected);
      setQrDataUrl(res.data.qrDataUrl);
      setLastConnectedJid(res.data.lastConnectedJid);
      setPolling(true);
      toast.success("Session reset. Scan new QR.", { id: "wa-reset" });
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to reset", {
        id: "wa-reset",
      });
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  if (!isAdmin) {
    return <div className="p-6">Access denied</div>;
  }

  const qrImgSrc = useMemo(() => {
    if (qrDataUrl) return qrDataUrl;
    if (qrString) {
      return `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(
        qrString
      )}`;
    }
    return undefined;
  }, [qrDataUrl, qrString]);

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">WhatsApp Integration</h1>
        <div className="flex gap-2">
          <Button onClick={startConnect} variant="default">
            Connect
          </Button>
          <Button onClick={onReset} variant="outline">
            Reset
          </Button>
        </div>
      </div>

      {lastConnectedJid && (
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Last connected: {lastConnectedJid}
        </div>
      )}

      {!connected && qrImgSrc && (
        <div className="rounded-md border p-4 bg-white dark:bg-slate-900">
          <p className="mb-2 text-sm text-gray-600 dark:text-gray-300">
            Scan this QR with the WhatsApp app
          </p>
          <img src={qrImgSrc} alt="WhatsApp QR" className="w-64 h-64" />
        </div>
      )}

      <div className="rounded-md border p-4 bg-white dark:bg-slate-900 space-y-3">
        <h2 className="font-medium">Send Message</h2>
        <label className="text-sm text-gray-600 dark:text-gray-300">
          Numbers (comma or newline separated)
        </label>
        <textarea
          className="w-full min-h-24 p-2 rounded-md border bg-transparent"
          value={numbers}
          onChange={(e) => setNumbers(e.target.value)}
          placeholder="2526xxxxxxxx, 2526yyyyyyyy"
        />
        <label className="text-sm text-gray-600 dark:text-gray-300">
          Message
        </label>
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message text"
        />
        <div className="flex justify-end">
          <Button onClick={onSend} disabled={sending || !connected}>
            {sending ? "Sending..." : connected ? "Send" : "Connect first"}
          </Button>
        </div>
      </div>
    </div>
  );
}
