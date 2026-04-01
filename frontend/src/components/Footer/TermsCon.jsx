import React from "react";

const TermsCon = () => {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing and using the Church of God Full Gospel In India (the \"Sanctuary Platform\"), you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please refrain from using our services."
    },
    {
      title: "2. User Conduct & Responsibility",
      content: "Users are responsible for maintaining the confidentiality of their account credentials. Any activity performed under your account is your sole responsibility. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate."
    },
    {
      title: "3. Donations & Merchandise",
      content: "All donations made through the platform are voluntary and non-refundable unless specified otherwise by law. Merchandise purchases are subject to availability. Prices and availability of products are subject to change without notice. We reserve the right to refuse any order placed with us."
    },
    {
      title: "4. Intellectual Property",
      content: "All content on this platform, including text, graphics, logos, images, and software, is the property of Church of God or its content suppliers and is protected by international copyright laws. Unauthorized use of any materials may violate copyright, trademark, and other laws."
    },
    {
      title: "5. Privacy & Data Security",
      content: "Your privacy is important to us. Our collection and use of personal information are governed by our Privacy Policy. By using the platform, you consent to the collection and use of your data as outlined there."
    },
    {
      title: "6. Limitation of Liability",
      content: "Church of God shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use the platform or for the cost of procurement of substitute goods and services."
    },
    {
      title: "7. Modifications to Service",
      content: "We reserve the right to modify or discontinue, temporarily or permanently, the platform (or any part thereof) with or without notice. You agree that we shall not be liable to you or to any third party for any modification, suspension, or discontinuance of the service."
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 px-6 md:px-16 lg:px-32 flex flex-col items-center animate-fadeIn">
      <div className="max-w-4xl w-full">
        {/* Header Section */}
        <div className="text-center mb-20 border-b-2 border-foreground pb-12">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-4">Legal Framework</p>
          <h1 className="text-5xl md:text-7xl font-serif font-black text-foreground tracking-tighter">Terms & Conditions</h1>
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

        {/* Closing Declaration */}
        <div className="mt-24 p-10 bg-card border border-border text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-accent" />
          <p className="text-lg font-serif font-bold text-foreground mb-2">Acknowledgement</p>
          <p className="text-sm text-muted-foreground uppercase tracking-widest font-black leading-loose">
            By continuing to use this platform, you affirm your commitment to these standards of digital conduct and fellowship.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsCon;