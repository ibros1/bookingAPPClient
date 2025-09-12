import Footer from "@/components/footer";
import Header from "@/components/header";
import { Outlet } from "react-router-dom";

const MainRoute = () => {
  return (
    <div className="w-full">
      <Header />
      <div className="flex-1 min-h-screen">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default MainRoute;
