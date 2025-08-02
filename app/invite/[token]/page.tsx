"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import InviteAcceptPage from '../../../components/invite/InviteAcceptPage';

export default function InvitePage({ params }: { params: { token: string } }) {
  const router = useRouter();
  
  return <InviteAcceptPage inviteToken={params.token} />;
}
