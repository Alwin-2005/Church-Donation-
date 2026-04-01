import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DonationLayout from "./DonationLayout";
import api from "../../api/axios";
import { Loader2 } from "lucide-react";

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
        <div className="pt-32 flex justify-center min-h-screen bg-background items-center flex-col">
            <Loader2 className="animate-spin text-accent mb-4" size={32} />
            <p className="font-bold tracking-widest text-[10px] uppercase text-foreground/50">Loading Tithe streams...</p>
        </div>
    );

    return (
        <div className="w-full bg-background min-h-screen text-foreground font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 pb-32">

                {/* Intro Section */}
                <div className="border border-line p-10 md:p-16 mb-16 relative">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-4 mb-6">
                            <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight">Monthly Tithes</h1>
                        </div>
                        <p className="font-sans text-xl leading-relaxed font-medium italic text-foreground/80">
                            "Bring the whole tithe into the storehouse, that there may be food in my house."
                        </p>
                        <p className="mt-6 text-[11px] uppercase tracking-widest font-bold text-accent">
                            Your faithful contributions support our ministry.
                        </p>
                    </div>
                </div>

                {titheCampaigns.length === 0 ? (
                    <div className="border border-line p-20 text-center">
                        <h2 className="font-serif text-3xl font-bold mb-4">No Active Tithe Stream</h2>
                        <p className="text-foreground/70 max-w-sm mx-auto">
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
                <div className="mt-16 border border-line p-10 md:p-12">
                    <h3 className="font-serif text-2xl font-bold mb-6 flex items-center gap-3">
                        Sanctuary Stewardship
                    </h3>
                    <p className="text-foreground/80 leading-relaxed font-sans max-w-3xl">
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
