"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CustomButton } from '../index';
import Dialog from '../ui/Dialog';
import { colors, fonts } from '../../styles/theme';

interface ImportCommunityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onMethodSelect: (method: 'eventbrite' | 'csv' | 'manual') => void;
}

const ImportCommunityDialog: React.FC<ImportCommunityDialogProps> = ({
  isOpen,
  onClose,
  onMethodSelect
}) => {
  const [loading, setLoading] = useState(false);

  const handleMethodSelect = async (method: 'eventbrite' | 'csv' | 'manual') => {
    setLoading(true);
    try {
      onMethodSelect(method);
    } catch (error) {
      console.error('Error selecting method:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div className="w-full h-full flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12 p-6 lg:p-8">
        {/* Left Side - Text Content & Actions (Card1 Style) */}
        <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left z-10">
          <p
            className="text-sm font-bold tracking-[0.2em] uppercase"
            style={{ color: colors.card.tagText, fontFamily: fonts.card }}
          >
            COMMUNITY SETUP
          </p>
          <h2
            className="text-3xl lg:text-5xl font-bold leading-tight tracking-tighter"
            style={{ color: colors.card.headingText, fontFamily: fonts.card, letterSpacing: '-0.03em' }}
          >
            Create Your First Community
          </h2>
          <p 
            className="text-base lg:text-lg leading-relaxed"
            style={{ color: colors.card.bodyText, fontFamily: fonts.card }}
          >
            Choose how you'd like to set up your community and import your members. You can upload a CSV file, connect your Eventbrite account, or create everything manually.
          </p>
          
          <div className="space-y-4">
            {/* Eventbrite Method */}
            <CustomButton
              onClick={() => handleMethodSelect('eventbrite')}
              disabled={loading}
              variant="primary"
              className="w-full"
            >
              <div className="flex items-center justify-center space-x-3">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <div className="text-left">
                  <div className="font-semibold">Import from Eventbrite</div>
                  <div className="text-sm opacity-80">Connect your Eventbrite account</div>
                </div>
              </div>
            </CustomButton>

            {/* CSV Method */}
            <CustomButton
              onClick={() => handleMethodSelect('csv')}
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              <div className="flex items-center justify-center space-x-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0-1.125.504-1.125 1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <div className="text-left">
                  <div className="font-semibold">Upload CSV File</div>
                  <div className="text-sm opacity-80">Import member data from spreadsheet</div>
                </div>
              </div>
            </CustomButton>

            {/* Manual Method */}
            <CustomButton
              onClick={() => handleMethodSelect('manual')}
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              <div className="flex items-center justify-center space-x-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
                <div className="text-left">
                  <div className="font-semibold">Create Manually</div>
                  <div className="text-sm opacity-80">Set up community from scratch</div>
                </div>
              </div>
            </CustomButton>
          </div>
        </div>

        {/* Right Side - Parallax Image (Card1 Style) */}
        <div className="w-full lg:w-1/2 relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-blue-600/20"></div>
          <div 
            className="w-full h-full min-h-[400px] lg:min-h-[600px] bg-cover bg-center bg-no-repeat relative"
            style={{
              backgroundImage: `url('data:image/svg+xml,${encodeURIComponent(`
                <svg viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="communityGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style="stop-color:#8B5CF6;stop-opacity:0.8" />
                      <stop offset="50%" style="stop-color:#E0407B;stop-opacity:0.6" />
                      <stop offset="100%" style="stop-color:#3B82F6;stop-opacity:0.8" />
                    </linearGradient>
                  </defs>
                  <rect width="400" height="600" fill="url(#communityGrad)" />
                  <circle cx="200" cy="150" r="60" fill="white" fill-opacity="0.1" />
                  <circle cx="150" cy="200" r="20" fill="white" fill-opacity="0.8" />
                  <circle cx="200" cy="180" r="25" fill="white" fill-opacity="0.9" />
                  <circle cx="250" cy="200" r="20" fill="white" fill-opacity="0.8" />
                  <circle cx="200" cy="220" r="15" fill="white" fill-opacity="0.7" />
                  <path d="M150 200 Q200 160 250 200" stroke="white" stroke-width="2" fill="none" stroke-opacity="0.6" />
                  <path d="M200 180 Q180 200 200 220" stroke="white" stroke-width="2" fill="none" stroke-opacity="0.6" />
                  <path d="M200 180 Q220 200 200 220" stroke="white" stroke-width="2" fill="none" stroke-opacity="0.6" />
                  <circle cx="320" cy="450" r="40" fill="white" fill-opacity="0.05" />
                  <circle cx="80" cy="500" r="60" fill="white" fill-opacity="0.05" />
                </svg>
              `)})`,
              backgroundAttachment: 'fixed'
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white/80">
                <svg className="w-24 h-24 mx-auto mb-4 text-white/60" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
                <p className="text-lg font-medium opacity-60">Build Your Community</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ImportCommunityDialog;
