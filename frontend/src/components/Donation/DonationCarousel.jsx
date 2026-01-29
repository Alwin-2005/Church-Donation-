import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import DonationCampaignCard from "./DonationCampaignCard";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const DonationCarousel = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        fetchCampaigns();
    }, [user]);

    // Auto-slide effect
    useEffect(() => {
        if (campaigns.length <= 1) return;

        const interval = setInterval(() => {
            handleNext();
        }, 4000);

        return () => clearInterval(interval);
    }, [currentIndex, campaigns]);

    const fetchCampaigns = async () => {
        try {
            setLoading(true);
            let fetchedCampaigns = [];

            // Fetch External Campaigns (Everyone sees these)
            const resExt = await api.get("users/exdonationcampaigns/view");
            if (resExt.data?.Result) {
                fetchedCampaigns = [...fetchedCampaigns, ...resExt.data.Result];
            }

            // Fetch Internal Campaigns (Only Church Members sees these)
            if (user?.role === "churchMember") {
                try {
                    const resInt = await api.get("users/indonationcampaigns/view", { withCredentials: true });
                    if (resInt.data?.Result) {
                        fetchedCampaigns = [...fetchedCampaigns, ...resInt.data.Result];
                    }
                } catch (err) {
                    console.error("Error fetching internal campaigns", err);
                }
            }

            // Filter only active campaigns
            const activeCampaigns = fetchedCampaigns.filter(c => c.status === 'active');
            setCampaigns(activeCampaigns);
        } catch (err) {
            console.error("Error fetching campaigns for carousel", err);
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % campaigns.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + campaigns.length) % campaigns.length);
    };

    // Determine "See More" link based on role
    const seeMoreLink = user?.role === "churchMember" ? "/IntDon" : "/ExtDon";
    const seeMoreText = user?.role === "churchMember" ? "View All Campaigns" : "View All Causes";

    if (loading) return null;
    if (campaigns.length === 0) return null;

    // Logic to show 1 card on mobile, 3 on desktop logic is handled visually by overflow and flex
    // For simplicity implementation, we render a window of cards or just slide the whole track
    // Here we will implement a clean track slider

    // Responsive Visible Count
    // We want to show:
    // Mobile: 1 card
    // Tablet: 2 cards
    // Desktop: 3 cards
    // But doing real responsive carousel math can be tricky. 
    // Let's do a simple version: Always show a sliding track, and the user sees what fits.
    // Actually, requested is "a couple of cards which slide automatically".
    // Let's render a visible window.

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex justify-between items-end mb-8">
                    <div className="text-left">
                        <h2 className="text-3xl font-bold text-white drop-shadow-md">Make a Difference</h2>
                        <p className="text-gray-200 mt-2 font-medium drop-shadow-sm">Support our latest campaigns and causes</p>
                    </div>
                    <Link
                        to={seeMoreLink}
                        className="hidden sm:flex items-center gap-2 text-white font-semibold hover:text-yellow-400 transition-colors drop-shadow-md"
                    >
                        {seeMoreText} <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Carousel Container */}
                <div className="relative group">
                    {/* Main Viewport */}
                    <div className="overflow-hidden p-4 -m-4">
                        <div
                            className="flex transition-transform duration-500 ease-in-out gap-6"
                            style={{ transform: `translateX(-${currentIndex * (280 + 24)}px)` }}
                        // 280px card width + 24px gap. 
                        // Note: This simple math assumes fixed width cards. 
                        // If we want it fully responsive, we might need a library or % based widths.
                        // Let's stick to the card width set in compact mode (280px).
                        >
                            {campaigns.map((campaign) => (
                                <div key={campaign._id} className="flex-shrink-0">
                                    <DonationCampaignCard
                                        campaign={campaign}
                                        role={user?.role} // Pass role to allow "Donate" button logic
                                        onDonate={(c) => navigate(`/donate/${c._id}`)}
                                        compact={true}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Controls */}
                    {campaigns.length > 3 && ( // Only show controls if plenty of items
                        <>
                            <button
                                onClick={handlePrev}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 bg-black/50 hover:bg-indigo-600 p-2 rounded-full shadow-lg text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={handleNext}
                                className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 bg-black/50 hover:bg-indigo-600 p-2 rounded-full shadow-lg text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}

                </div>

                {/* Mobile See More */}
                <div className="mt-8 text-center sm:hidden">
                    <Link
                        to={seeMoreLink}
                        className="inline-flex items-center gap-2 text-white font-semibold hover:text-yellow-400 drop-shadow-md"
                    >
                        {seeMoreText} <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default DonationCarousel;
