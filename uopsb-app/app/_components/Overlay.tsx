import React from "react";

interface OverlayProps {
  children: React.ReactNode;
  onClose: () => void;
}

const Overlay: React.FC<OverlayProps> = ({ children, onClose }) => {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white p-6 rounded shadow-lg">
        {children}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 focus:outline-none"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default Overlay;