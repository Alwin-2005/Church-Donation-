import React from "react";

const Privacy = () => {
  const sections = [
    {
      title: "1. Data Collection",
      content: "We collect information you provide directly to us when you create an account, make a donation, or purchase merchandise. This includes your name, email address, phone number, and mailing address."
    },
    {
      title: "2. How We Use Your Data",
      content: "Information collected is used to process transactions, maintain your profile, send updates regarding your donations and orders, and improve our services. We do not sell your personal data to third parties."
    },
    {
      title: "3. Payment Security",
      content: "All payments are processed through secure third-party gateways (e.g., Razorpay). We do not store your credit card or bank account details on our servers."
    },
    {
      title: "4. Cookies & Tracking",
      content: "Our platform may use cookies to enhance your experience and remember your preferences. You can manage cookie settings through your browser at any time."
    },
    {
      title: "5. Data Retention",
      content: "We retain your personal information for as long as necessary to provide our services and comply with legal obligations."
    },
    {
      title: "6. Your Rights",
      content: "You have the right to access, update, or delete your personal information stored in our system. Please contact us if you wish to exercise these rights."
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 px-6 md:px-16 lg:px-32 flex flex-col items-center animate-fadeIn">
      <div className="max-w-4xl w-full">
        {/* Header Section */}
        <div className="text-center mb-20 border-b-2 border-foreground pb-12">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-4">Privacy Framework</p>
          <h1 className="text-5xl md:text-7xl font-serif font-black text-foreground tracking-tighter">Privacy Policy</h1>
          <p className="text-xs font-medium text-muted-foreground mt-6 uppercase tracking-widest">Last Updated: April 2026</p>
        </div>

        {/* Content Section */}
        <div className="space-y-16">
          {sections.map((section, index) => (
            <div key={index} className="group border-l-2 border-border pl-8 hover:border-accent transition-colors duration-500">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4 group-hover:text-accent transition-colors">{section.title}</h2>
              <p className="text-base leading-relaxed text-foreground/70 font-medium">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        {/* Security Badge */}
        <div className="mt-24 p-10 bg-card border border-border text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-accent" />
          <p className="text-lg font-serif font-bold text-foreground mb-2">Integrated Security</p>
          <p className="text-sm text-muted-foreground uppercase tracking-widest font-black leading-loose">
            Your data is protected by industry-standard encryption and processed with absolute integrity.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
