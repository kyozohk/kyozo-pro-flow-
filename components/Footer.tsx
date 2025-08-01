
import React from 'react';
import KyozoLogo from './ui/KyozoLogo';
import KyozoIcon from './ui/KyozoIcon';
import { CustomButton } from './index';


const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full p-4 md:p-6 flex justify-center items-center z-40">
      <div className="bg-[#1C1C1C] rounded-full p-1 flex items-center space-x-4">
        <div className="pl-4">
            <KyozoLogo/>
        </div>
        <CustomButton variant="primary" size="default">
            Get Started
        </CustomButton>
      </div>
    </footer>
  );
};

export default Footer;
