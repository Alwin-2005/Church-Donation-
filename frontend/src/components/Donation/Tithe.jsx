import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DonationLayout from "./DonationLayout";
import api from "../../api/axios";
import { Heart, Info } from "lucide-react";
import gvimg from "../../assets/giving.jpg";

const Tithe = () => {
    const navigate = useNavigate();
    const [titheCampaigns, setTitheCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchTitheCampaigns();
    }, []);

    const fetchTitheCampaigns = async () => {
        try {
            const res = await api.get("users/indonationcampaigns/view", { withCredentials: true });
            const tithes = res.data?.Result?.filter(c => c.isTithe && c.status === 'active');
            setTitheCampaigns(tithes || []);
        } catch (err) {
            console.error(err);
            setError("Unable to fetch Tithe campaigns");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="pt-32 flex justify-center min-h-screen bg-black">
            <div className="animate-pulse text-white/50 font-medium flex items-center gap-2">
                <Heart className="animate-bounce" /> Loading Tithe streams...
            </div>
        </div>
    );

    return (
        <div className="relative min-h-screen pt-24 pb-20">
            {/* Full Background Image */}
            <div className="fixed inset-0 z-0">
                <img
                    src={gvimg}
                    className="w-full h-full object-cover"
                    alt="Giving background"
                />
                <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Intro Section */}
                <div className="bg-black/40 backdrop-blur-xl text-white rounded-[40px] p-10 mb-12 border border-white/10 shadow-2xl relative overflow-hidden group">
                    <div className="relative z-10 max-w-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-yellow-500 p-3 rounded-2xl shadow-lg shadow-yellow-500/20">
                                <Heart className="w-8 h-8 fill-white text-white" />
                            </span>
                            <h1 className="text-4xl font-black tracking-tight uppercase">Monthly Tithes</h1>
                        </div>
                        <p className="text-gray-300 text-xl leading-relaxed font-medium italic">
                            "Bring the whole tithe into the storehouse, that there may be food in my house."
                        </p>
                        <p className="text-gray-400 mt-4 text-sm uppercase tracking-widest font-bold">
                            Your faithful contributions support our ministry.
                        </p>
                    </div>
                    {/* Decorative element */}
                    <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-yellow-500/20 blur-[100px] rounded-full group-hover:bg-yellow-500/30 transition-all duration-500" />
                </div>

                {titheCampaigns.length === 0 ? (
                    <div className="bg-white/5 backdrop-blur-md rounded-[40px] p-20 text-center border border-white/10 shadow-xl">
                        <div className="bg-white/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/20">
                            <Info className="w-12 h-12 text-gray-300" />
                        </div>
                        <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">No Active Tithe Stream</h2>
                        <p className="text-gray-400 max-w-sm mx-auto font-medium">
                            The sanctuary administration has not activated a Tithe stream yet. Please check back later.
                        </p>
                    </div>
                ) : (
                    <div className="animate-fadeIn">
                        <DonationLayout
                            title="Available Tithe Streams"
                            campaigns={titheCampaigns}
                            role="churchMember"
                            simple={true}
                            onDonate={(c) => navigate(`/donate/${c._id}`)}
                        />
                    </div>
                )}

                {/* Info Card */}
                <div className="mt-12 bg-white/5 backdrop-blur-xl rounded-[30px] p-8 border border-white/10 shadow-xl">
                    <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2 uppercase tracking-wide">
                        <Info className="w-6 h-6 text-yellow-500" /> Sanctuary Stewardship
                    </h3>
                    <p className="text-gray-300 text-base leading-relaxed font-medium">
                        Tithes at Church of God are handled as goalless contributions. Unlike specific fundraising campaigns,
                        Tithes provide the bedrock for our daily operations, staff support, and long-term community projects.
                        Members are encouraged to contribute their monthly portion faithfully.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Tithe;
