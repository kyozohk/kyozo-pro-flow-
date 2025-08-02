import React from 'react';
import CommunityDetailPage from '../../../../components/dashboard/communities/CommunityDetailPage';

export default function CommunityDetail({ params }: { params: { id: string } }) {
  return <CommunityDetailPage communityId={params.id} />;
}
