import React, { useState, useEffect } from 'react';

interface DialogProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ title, onClose, children }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    setIsVisible(true);
    // Prevent background scrolling when the dialog is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    // Wait for the animation to finish before calling the parent's close handler
    setTimeout(() => {
      onClose();
    }, 500); // This duration should match the curtain animation duration
  };

  // A single state to represent if the dialog should be in its open state
  const isOpen = isVisible && !isClosing;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      
      {/* Animated Dialog Container */}
      <div
        className={`relative z-10 w-full max-w-lg text-white transition-[clip-path] duration-500 ease-in-out`}
        style={{ clipPath: isOpen ? 'inset(0 0%)' : 'inset(0 50%)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* The actual dialog content with border and background */}
        <div className="relative rounded-3xl bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500 p-[1px] shadow-2xl">
            <div className="bg-[#1C1C1E] rounded-[23px] p-8 md:p-12">
                <h2 id="dialog-title" className="text-5xl md:text-6xl font-bold text-center mb-12">{title}</h2>
                <div className="space-y-8">
                    {children}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dialog;
