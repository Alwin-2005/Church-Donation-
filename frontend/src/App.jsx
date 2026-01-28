import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Sec1 from "./components/Section1/section1";
import Log from "./components/Login/Log";
import Regis from "./components/Regis/Regis";
import Users from "./components/Admin/Users";
import AdminPanel from "./components/Admin/adminPanel";
import AdminDashboard from "./components/Admin/AdminDashboard";
import ExDonation from "./components/Donation/ExDonation";
import IntDonation from "./components/Donation/IntDonation";
import TermsCon from "./components/Footer/TermsCon";
import NotFound from "./components/NotFound";
import Profile from "./components/Profile";
import Event from "./components/Events/Event";
import AdminDonation from "./components/Admin/adminDonation";
import AdminEvent from "./components/Admin/AdminEvent";
import AdminPayments from "./components/Admin/AdminPayments";
import AdminProducts from "./components/Admin/AdminProducts";
import AdminOrders from "./components/Admin/AdminOrders";
import DonationHistory from "./components/Admin/DonationHistory";
import Shop from "./components/Shop/Shop";
import Cart from "./components/Shop/Cart";
import AdminUsers from "./components/Admin/AdminUsers";
import {CartProvider} from "./components/Shop/CartContext";
import {AuthProvider} from "./context/AuthContext";



const App = () => {
  return (
    <div className="w-full overflow-x-hidden">
      
      <AuthProvider>
      <CartProvider>
          <Routes>
            
            <Route path="/login" element={<Log />} />
            <Route path="/register" element={<Regis />} />
            
            <Route element={<MainLayout/>}>
            <Route path="/" element={<Sec1 />} />
            <Route path="/events" element={<Event/>}/>       
            <Route path="/profile" element={<Profile />}/>
            <Route path="/TermsCon" element={<TermsCon/>}/>
            <Route path="/ExtDon" element={<ExDonation/>}/>
            <Route path="/IntDon" element={<IntDonation/>}/>
            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
          

            <Route path="/admin" element={<AdminPanel />}>
            
              
              <Route path="users" element={<Users />} />
              <Route path="dashboard" element={<AdminDashboard/>}  />
              <Route path="products" element={<AdminProducts/>}/>
              <Route path="orders" element={<AdminOrders/>}/>
              <Route path="events" element={<AdminEvent/>}/>
              <Route path="campaigns" element={<AdminDonation/>}/>
              <Route path="donations" element={<DonationHistory/>}/>
              <Route path="payments" element={<AdminPayments/>}/>
            </Route>
            </Route>
            
            <Route path="*" element={<NotFound/>}/>
            

          </Routes>
      </CartProvider>
      
      </AuthProvider>
    </div>
  );
};

export default App;
