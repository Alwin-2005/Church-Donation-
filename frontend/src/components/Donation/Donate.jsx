import React, { useState, useEffect } from "react";
import Navbar from "../NavBar/NavBar";
import api from "../../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Loader2, Heart, ShieldCheck, CreditCard } from "lucide-react";

const DonatePage = () => {
  const { campaignId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        // Try fetching external first
        const res = await api.get(`home/donationcampaigns/view`);
        const found = res.data?.Result?.find(c => c._id === campaignId);

        if (found) {
          setCampaign(found);
        } else {
          // Try direct view if not in list (might be internal)
          const resDirect = await api.get(`users/exdonationcampaigns/view/${campaignId}`);
          setCampaign(resDirect.data.Result);
        }
      } catch (err) {
        setError("Campaign not found");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [campaignId]);

  const handleDonate = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!amount || amount <= 0) {
      alert("Please enter a valid donation amount");
      return;
    }

    setIsProcessing(true);
    try {
      // 1. Create Order in Backend
      const { data: order } = await api.post("/payment/donation/create-order", {
        amount: Number(amount),
        campaignId: campaignId
      });

      // 2. Open Razorpay Modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_S9mLYwTd390Rjg",
        amount: order.amount,
        currency: order.currency,
        name: "Church Donation",
        description: `Donation for: ${campaign.title}`,
        order_id: order.id,
        handler: async function (response) {
          try {
            // 3. Verify Payment
            await api.post("/payment/donation/verify", {
              ...response,
              amount: Number(amount),
              userId: user._id,
              campaignId: campaignId
            });

            alert("Thank you for your generous donation! Progress has been updated.");
            navigate("/");
          } catch (err) {
            console.error("Verification failed:", err);
            alert("Donation verification failed. Please contact support.");
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
        alert("Donation Failed: " + response.error.description);
      });
      rzp.open();

    } catch (err) {
      console.error("Donation error:", err);
      alert(err.response?.data?.msg || "Failed to initiate donation");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin mx-auto text-black mb-4" />
        <p className="text-gray-500 font-medium">Loading campaign details...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md border border-gray-100">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-red-500 text-2xl">⚠️</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Campaign Not Found</h2>
        <p className="text-gray-500 mb-6">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-all"
        >
          Go Back
        </button>
      </div>
    </div>
  );

  if (!campaign) return null;

  const progress = Math.min((campaign.collectedAmount / campaign.goalAmount) * 100, 100);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <Navbar />

      <div className="pt-28 max-w-4xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">

          {/* LEFT: DETAILS */}
          <div className="md:col-span-3 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="h-2 bg-black w-full" />
              <div className="p-8">
                <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 inline-block">
                  {campaign.donationType} Campaign
                </span>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-4 leading-tight">
                  {campaign.title}
                </h1>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {campaign.description}
                </p>

                <div className="mt-8 pt-8 border-t border-gray-100">
                  <div className="flex justify-between items-end mb-3">
                    <div>
                      <p className="text-gray-400 uppercase text-[10px] font-bold tracking-[0.2em] mb-1">Total Raised</p>
                      <p className="text-3xl font-black text-black">₹{campaign.collectedAmount.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 uppercase text-[10px] font-bold tracking-[0.2em] mb-1">Goal</p>
                      <p className="text-xl font-bold text-gray-400">₹{campaign.goalAmount.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden relative">
                    <div
                      className="bg-black h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-right text-sm font-bold mt-2 text-black">{Math.round(progress)}% of goal reached</p>
                </div>
              </div>
            </div>

            <div className="bg-black rounded-3xl p-8 text-white shadow-xl flex items-center gap-6">
              <div className="p-4 bg-white/10 rounded-2xl">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Secure Contribution</h3>
                <p className="text-gray-400 text-sm">Your generous donation is encrypted and directly supports our community missions.</p>
              </div>
            </div>
          </div>

          {/* RIGHT: DONATION FORM */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sticky top-28">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500 fill-red-500" /> Support this Cause
              </h2>

              <div className="space-y-4">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-400">₹</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white rounded-2xl px-10 py-4 outline-none transition-all text-2xl font-black"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[500, 1000, 2000, 5000].map((val) => (
                    <button
                      key={val}
                      onClick={() => setAmount(val)}
                      className={`py-3 rounded-xl font-bold border-2 transition-all ${Number(amount) === val
                          ? "bg-black border-black text-white shadow-lg"
                          : "bg-white border-gray-100 text-gray-600 hover:border-gray-300"
                        }`}
                    >
                      ₹{val}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleDonate}
                  disabled={campaign.status !== "active" || isProcessing}
                  className="w-full bg-black text-white py-5 rounded-2xl text-lg font-bold hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-3"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" /> Contribute Now
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-gray-400 font-medium pt-4">
                  By contributing, you agree to our terms of service and donation policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonatePage;
