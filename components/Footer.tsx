
import React from 'react';
import KyozoLogo from './ui/KyozoLogo';
import KyozoIcon from './ui/KyozoIcon';


const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full p-4 md:p-6 flex justify-center items-center z-40">
      <div className="bg-[#1C1C1C] rounded-full p-1 flex items-center space-x-4">
        <div className="pl-4">
            <KyozoLogo/>
        </div>
        <button className="font-bold transition-all duration-300 ease-in-out bg-[#E0407B] text-white hover:bg-pink-600 py-3 px-8 rounded-full text-lg">
            Get Started
        </button>
      </div>
    </footer>
  );
};

export default Footer;
