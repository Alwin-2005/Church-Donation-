import React, { useState } from "react";
import Navbar from "../NavBar/NavBar";
import { useCart } from "./CartContext";
import { useAuth } from "../../context/AuthContext";
import { Trash2, Smartphone, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../../api/axios";

const Cart = () => {
  const { cart, updateCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const total = cart.reduce((sum, i) => sum + i.qty * i.price, 0);

  const handleRemove = (item) => {
    updateCart(item, 0);
  };

  const handleCheckout = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setIsProcessing(true);
    try {
      // 0. Check if user has an address
      const { data: profile } = await api.get("/users/profile/view");
      const userData = profile[0]; // Controller returns an array

      if (!userData || !userData.address) {
        toast.error("Please provide a delivery address in your profile before checking out.");
        navigate("/profile");
        return;
      }

      // 1. Create Order in Backend
      const itemsToOrder = cart.map(item => ({
        itemId: item.id || item._id, // Ensure we use the correct ID field
        quantity: item.qty,
        price: item.price
      }));

      const { data: order } = await api.post("/payment/merch/create-order", {
        items: itemsToOrder,
        totalAmount: total,
        userId: user._id
      });

      // 2. Open Razorpay Modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_S9mLYwTd390Rjg",
        amount: order.amount,
        currency: order.currency,
        name: "Church Donation Store",
        description: "Purchase of Merchandise",
        order_id: order.id,
        handler: async function (response) {
          try {
            // 3. Verify Payment
            const verificationData = {
              ...response,
              items: itemsToOrder,
              totalAmount: total,
              userId: user._id
            };

            await api.post("/payment/merch/verify", verificationData);
            toast.success("Payment Successful! Your order has been placed.");
            clearCart();
            navigate("/shop");
          } catch (err) {
            console.error("Verification failed:", err);
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: user.fullname,
          email: user.email,
          contact: user.phoneNo
        },
        theme: {
          color: "#000000"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        toast.error("Payment Failed: " + response.error.description);
      });
      rzp.open();

    } catch (err) {
      console.error("Checkout error:", err);
      toast.error(err.response?.data?.msg || "Failed to initiate checkout");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-background min-h-screen pb-20">
      <Navbar />

      <div className="pt-32 max-w-7xl mx-auto px-6">
        <div className="border-b border-line pb-8 mb-12">
          <span className="text-[10px] font-bold uppercase tracking-widest text-accent mb-4 block">Your Sanctuary Selection</span>
          <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tight text-foreground">
            Shopping Cart ({cart.reduce((a, c) => a + c.qty, 0)})
          </h1>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-20 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-400 mb-4">Your cart is empty</h2>
            <Link to="/shop" className="text-foreground font-semibold underline hover:text-amber-600 transition-colors">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-scaleIn">

            {/* LEFT: CART ITEMS */}
            <div className="lg:col-span-2">
              <div className="border-t border-line">
                {cart.map((item) => (
                  <div key={item.id || item._id} className="py-12 border-b border-line flex flex-col sm:flex-row gap-8 items-center group transition-colors">
                    <div className="w-32 h-32 bg-muted overflow-hidden flex-shrink-0 border border-line">
                      {item.url ? (
                        <img src={item.url} alt={item.itemName} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] uppercase tracking-widest font-bold text-foreground/20">No Img</div>
                      )}
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="font-serif text-2xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors">{item.itemName}</h3>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-accent mb-4">{item.category}</p>
                      <p className="font-serif text-xl font-bold text-foreground">₹{item.price}</p>
                    </div>

                    <div className="flex flex-col items-center sm:items-end gap-6">
                      <div className="flex items-center border border-line p-1">
                        <button
                          onClick={() => updateCart(item, item.qty - 1)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-line transition-colors text-foreground"
                        >-</button>
                        <span className="font-bold w-10 text-center text-sm">{item.qty}</span>
                        <button
                          onClick={() => updateCart(item, item.qty + 1)}
                          className="w-10 h-10 flex items-center justify-center bg-foreground text-background hover:bg-accent transition-colors"
                        >+</button>
                      </div>
                      <button
                        onClick={() => handleRemove(item)}
                        className="text-[9px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700 flex items-center gap-2 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" /> Remove Item
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: SUMMARY */}
            <div className="lg:col-span-1">
              <div className="border border-line bg-background p-8 sticky top-32">
                <h2 className="font-serif text-2xl font-bold mb-8 text-foreground pb-4 border-b border-line">Order Summary</h2>

                <div className="space-y-6 mb-8">
                  <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-foreground/40">
                    <span>Subtotal</span>
                    <span className="text-foreground">₹{total}</span>
                  </div>
                  <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-foreground/40">
                    <span>Delivery</span>
                    <span className="text-accent">Complimentary</span>
                  </div>
                  <div className="pt-6 border-t border-line flex justify-between">
                    <span className="font-serif text-xl font-bold">Total</span>
                    <span className="font-serif text-xl font-bold">₹{total}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full bg-accent hover:bg-foreground text-background py-4 font-bold text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-wait"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Processing order...
                    </>
                  ) : (
                    <>
                      Proceed to Checkout <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="mt-8 space-y-4 border-t border-line pt-8">
                  <div className="flex items-center gap-3 text-[9px] uppercase tracking-widest font-bold text-foreground/40">
                    <ShieldCheck size={16} className="text-accent" />
                    Secure Transaction
                  </div>
                  <div className="flex items-center gap-3 text-[9px] uppercase tracking-widest font-bold text-foreground/40">
                    <Smartphone size={16} className="text-accent" />
                    UPI & Global Networks
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
