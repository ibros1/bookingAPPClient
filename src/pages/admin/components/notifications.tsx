import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";

const Notifications = () => {
  return (
    <div className="flex justify-center items-center min-h-[70vh] px-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <CardTitle className="flex justify-center items-center gap-2 text-lg">
            <Bell className="w-6 h-6 text-gray-600" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-base">
            You have no notifications yet.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;
