
import React from 'react';
import KyozoLogo from './ui/KyozoLogo';
import KyozoIcon from './ui/KyozoIcon';


const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full p-4 md:p-6 flex justify-center items-center z-40">
      <div className="bg-[#1C1C1C] rounded-full p-1 flex items-center space-x-4">
        <div className="pl-4">
            <KyozoLogo className="h-6" />
        </div>
        <button className="bg-gradient-to-r from-[#D646FF] to-[#46A3FF] text-white font-bold py-3 px-6 rounded-full hover:opacity-90 transition-opacity">
            Join
        </button>
      </div>
    </footer>
  );
};

export default Footer;
