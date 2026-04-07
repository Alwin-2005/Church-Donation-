import React from "react";

const AboutUs = () => {
  const sections = [
    {
      title: "Our Heritage",
      content: "Founded with a deep commitment to faith and service, the Church of God has stood as a beacon of hope and unity for over fifty years. We trace our roots back to a small group of faithful believers who sought to create a true sanctuary for anyone seeking spiritual guidance and community."
    },
    {
      title: "Our Mission",
      content: "Our mission is simple yet profound: to serve people through faith, integrity, and modern innovation. We believe in bridging the gap between timeless spiritual teachings and contemporary life, making worship and community service accessible to everyone, anywhere."
    },
    {
      title: "Community Outreach",
      content: "A church is not just a building; it is the people. We actively engage in local and global outreach programs, distributing resources, supporting educational initiatives, and organizing campaigns to uplift the underprivileged and provide relief during times of crisis."
    },
    {
      title: "Digital Sanctuary",
      content: "In an ever-connected world, our Sanctuary Platform allows our congregation to stay united. Whether you are contributing via donations, attending virtual events, or acquiring exclusive church resources, we are committed to providing a seamless, secure, and beautiful digital experience."
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 px-6 md:px-16 lg:px-32 flex flex-col items-center animate-fadeIn">
      <div className="max-w-4xl w-full">
        {/* Header Section */}
        <div className="text-center mb-20 border-b-2 border-foreground pb-12">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-4">Discover Our Journey</p>
          <h1 className="text-5xl md:text-7xl font-serif font-black text-foreground tracking-tighter">About Us</h1>
          <p className="text-xs font-medium text-muted-foreground mt-6 uppercase tracking-widest">Built with faith. Serving with purpose.</p>
        </div>

        {/* Hero / Intro Image Placeholder text or minimal design */}
        <div className="mb-16 p-10 bg-card border border-border flex flex-col sm:flex-row items-center justify-between group hover:border-accent transition-colors duration-500">
          <div className="max-w-xl">
             <h2 className="text-3xl font-serif font-bold text-foreground mb-4">A Legacy of Grace</h2>
             <p className="text-sm leading-relaxed text-foreground/70 font-medium">
               We invite you to learn about our history, our core values, and our vision for the future. Every member of our community plays a vital role in carrying our mission forward.
             </p>
          </div>
          <div className="hidden sm:flex mt-8 sm:mt-0 items-center justify-center w-24 h-24 rounded-full border border-dashed border-accent">
            <span className="text-[10px] uppercase font-black tracking-widest text-accent rotate-[-45deg]">Est. 1974</span>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {sections.map((section, index) => (
            <div key={index} className="group border-l-2 border-border pl-6 hover:border-accent transition-colors duration-500">
              <h2 className="text-xl font-serif font-bold text-foreground mb-4 group-hover:text-accent transition-colors">{section.title}</h2>
              <p className="text-sm leading-relaxed text-foreground/70 font-medium">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        {/* Call To Action Badge */}
        <div className="mt-24 p-10 bg-accent text-accent-foreground text-center relative overflow-hidden transition-all duration-500 hover:scale-[1.02]">
          <p className="text-xl font-serif font-bold mb-3">Join Our Community</p>
          <p className="text-xs uppercase tracking-widest font-black leading-loose opacity-80">
            Be a part of something greater. Attend a service, join a campaign, or volunteer today.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
