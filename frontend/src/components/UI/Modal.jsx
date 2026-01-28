import React from "react";
import { X } from "lucide-react";

const Modal = ({ title, children, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal box */}
      <div className="relative bg-white w-full max-w-lg rounded-lg shadow-lg p-6 z-10 animate-scaleIn">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X />
          </button>
        </div>

        {/* Body */}
        {children}
      </div>
    </div>
  );
};

export default Modal;
