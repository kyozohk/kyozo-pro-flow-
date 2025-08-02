"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { colors, borderRadius, fontWeights, fontSizes } from '../../../styles/theme';
import CustomButton from '../../CustomButton';

interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  imageUrl?: string;
}

interface CommunityListProps {
  communities: Community[];
}

const CommunityList: React.FC<CommunityListProps> = ({ communities }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {communities.map((community) => (
        <div 
          key={community.id} 
          className={`bg-[${colors.bgCard}] ${borderRadius.xl} border border-[${colors.borderDark}] overflow-hidden shadow-lg`}
        >
          <div className="h-40 bg-gradient-to-r from-[${colors.gradientStart}] to-[${colors.gradientEnd}] relative">
            {community.imageUrl && (
              <Image
                src={community.imageUrl}
                alt={community.name}
                fill
                className="object-cover"
              />
            )}
          </div>
          
          <div className="p-6">
            <h3 className={`${fontSizes.xl} ${fontWeights.bold} text-[${colors.textPrimary}] mb-2`}>
              {community.name}
            </h3>
            <p className={`text-[${colors.textSecondary}] mb-4 line-clamp-2`}>
              {community.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-[${colors.textSecondary}] mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className={`text-sm text-[${colors.textSecondary}]`}>
                  {community.memberCount} members
                </span>
              </div>
              <Link href={`/dashboard/communities/${community.id}`}>
                <CustomButton 
                  variant="text" 
                  className={`text-[${colors.primary}] hover:text-[${colors.primaryHover}]`}
                >
                  Manage
                </CustomButton>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommunityList;
