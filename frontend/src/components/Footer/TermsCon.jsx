import React from "react";

const TermsCon = () => {
  return (
    <div className="min-h-screen bg-background pt-[120px] pb-24 px-6 md:px-16 lg:px-32 flex flex-col items-center">
      <div className="max-w-4xl w-full bg-card shadow-sm border border-border rounded-xl p-8 md:p-12 animate-fadeIn">
        
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
          Terms & Conditions
        </h1>

        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <p>
            By using this application, you agree to provide accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </p>
          
          <p>
            We reserve the right to modify, suspend, or terminate access to the service at any time without prior notice if misuse, unauthorized activity, or violation of policies is detected.
          </p>

          <p>
            Personal information collected will be used only for authentication, communication, and service improvement purposes. We do not guarantee uninterrupted or error-free access to the application.
          </p>

          <div className="pt-6 mt-6 border-t border-border">
            <p className="font-semibold text-foreground">
              By continuing, you acknowledge that you have read, understood, and agreed to these terms and conditions.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TermsCon;