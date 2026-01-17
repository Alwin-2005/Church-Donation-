import React from "react";
import { Routes, Route } from "react-router-dom";
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
import AdminPayments from "./components/Admin/AdminPayments";
import AdminProducts from "./components/Admin/AdminProducts";
import AdminOrders from "./components/Admin/AdminOrders";
import DonationHistory from "./components/Admin/DonationHistory";
import Shop from "./components/Shop/Shop";

const App = () => {
  return (
    <div className="w-full overflow-x-hidden">
      <Routes>
        <Route path="/" element={<Log />} />
        <Route path="/home" element={<Sec1 />} />
        <Route path="/events" element={<Event/>}/>
        <Route path="/profile" element={<Profile />}/>
        <Route path="/registerNow" element={<Regis />} />
        <Route path="/TermsCon" element={<TermsCon/>}/>
        <Route path="/ExtDon" element={<ExDonation/>}/>
        <Route path="/IntDon" element={<IntDonation/>}/>
        <Route path="/shop" element={<Shop/>}/>

        <Route path="/admin" element={<AdminPanel />}>
        
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="settings"  />
          <Route path="products" element={<AdminProducts/>}/>
          <Route path="orders" element={<AdminOrders/>}/>
          <Route path="events" element={<Event/>}/>
          <Route path="donationCampaign" element={<AdminDonation/>}/>
          <Route path="donation" element={<DonationHistory/>}/>
          <Route path="payment" element={<AdminPayments/>}/>
        </Route>
        
        <Route path="*" element={<NotFound/>}/>

      </Routes>
      
    </div>
  );
};

export default App;
