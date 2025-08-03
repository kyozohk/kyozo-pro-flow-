
"use client";

import React, { useState } from 'react';
import KyozoLogo from './ui/KyozoLogo';
import KyozoIcon from './ui/KyozoIcon';
import AuthDialog from './auth/AuthDialog';
import SignUpForm from './SignupForm';
import CustomButton from './CustomButton';


const Footer: React.FC = () => {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  const handleOpenAuthDialog = () => {
    setIsAuthDialogOpen(true);
  };

  const handleCloseAuthDialog = () => {
    setIsAuthDialogOpen(false);
  };

  return (
    <>
      <footer className="fixed bottom-0 left-0 w-full p-4 md:p-6 flex justify-center items-center z-40">
        <div className="bg-[#1C1C1C] rounded-full p-1 flex items-center space-x-4">
          <div className="pl-4">
              <KyozoLogo/>
          </div>
          <CustomButton 
            variant="primary"
            onClick={handleOpenAuthDialog}
          >
              Get Started
          </CustomButton>
        </div>
      </footer>

      {isAuthDialogOpen && (
        <SignUpForm 
          onSubmitted={handleCloseAuthDialog} 
        />
      )}
    </>
  );
}

export default Footer;
