
import React from 'react';
import Image from 'next/image';
import { Heading2, Paragraph, Button } from './ui/Typography';
import { colors } from '../styles/theme';

const Connect: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-[${colors.bgPrimary}]">
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute -top-32 -left-48 w-96 h-96 bg-purple-900/50 rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-32 -right-48 w-96 h-96 bg-cyan-900/50 rounded-full filter blur-3xl"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-24 sm:py-32 lg:py-40">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="text-center lg:text-left">
            <Heading2>
              Connect.
              <br />
              Explore.
              <br />
              Engage.
            </Heading2>
            <div className="mt-6 max-w-lg mx-auto lg:mx-0">
              <Paragraph>
                Connect with visionary creators and forward-thinking communities.
              </Paragraph>
            </div>
            <div className="mt-10">
              <Button>
                Join the waitlist
              </Button>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end -mr-8 lg:-mr-24">
            <div className="relative w-[300px] h-[600px] transform rotate-12">
               <Image 
                  src="/iphone.png" 
                  alt="Kyozo app on smartphone"
                  width={300}
                  height={600}
                  className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
               />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Connect;
