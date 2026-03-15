import { Outlet } from "react-router-dom";
import Navbar from "./NavBar/NavBar";
import Footer from "./Footer/Footer";

const MainLayout = () => {
  return (
    <>
      <div className="relative z-50">
        <Navbar />
      </div>
      <div className="relative">
        {/* prevents content going behind fixed navbar */}
        <Outlet />
      </div>
      <div className="relative z-40">
        <Footer />
      </div>
    </>
  );
};

export default MainLayout;
