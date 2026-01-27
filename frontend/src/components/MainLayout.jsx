import { Outlet } from "react-router-dom";
import Navbar from "./NavBar/NavBar";
import Footer from "./Footer/Footer";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <div >
        {/* prevents content going behind fixed navbar */}
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default MainLayout;
