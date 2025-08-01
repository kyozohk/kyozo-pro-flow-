import React from 'react';
import Image from 'next/image';

interface KyozoIconProps {
  className?: string;
}

const KyozoIcon: React.FC<KyozoIconProps> = ({ className }) => {
  return (
    <div className={className}>
      <Image 
        src="/favicon.png" 
        alt="Kyozo Icon" 
        width={32} 
        height={32} 
        className="w-auto h-auto"
      />
    </div>
  );
};

export default KyozoIcon;
