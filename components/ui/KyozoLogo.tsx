import React from 'react';
import Image from 'next/image';

interface KyozoLogoProps {
  className?: string;
}

const KyozoLogo: React.FC<KyozoLogoProps> = ({ className }) => {
  return (
    <div className={className}>
      <Image 
        src="/logo.png" 
        alt="Kyozo Logo" 
        width={84} 
        height={24} 
        className="w-auto h-auto"
      />
    </div>
  );
};

export default KyozoLogo;
