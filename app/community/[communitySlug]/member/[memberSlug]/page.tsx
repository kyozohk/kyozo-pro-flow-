"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CustomButton } from '../../../../../components/index';
import { colors } from '../../../../../styles/theme';

interface MemberProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  image?: string;
  bio?: string;
  linkedin?: string;
  twitter?: string;
  status: 'active' | 'inactive';
  joinedAt: string;
  source: 'eventbrite' | 'manual' | 'csv';
  eventbriteId?: string;
}

interface Community {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  themeColor: string;
}

const MemberProfilePage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const [member, setMember] = useState<MemberProfile | null>(null);
  const [community, setCommunity] = useState<Community | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  const { communitySlug, memberSlug } = params;

  useEffect(() => {
    const fetchMemberProfile = async () => {
      try {
        setLoading(true);
        
        // Fetch member profile data
        // In a real implementation, this would call your API
        const mockMember: MemberProfile = {
          id: memberSlug as string,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+1234567890',
          image: `https://ui-avatars.com/api/?name=John+Doe&size=200&background=E0407B&color=fff`,
          bio: 'Passionate developer and community member. Love connecting with like-minded individuals.',
          linkedin: 'https://linkedin.com/in/johndoe',
          twitter: 'https://twitter.com/johndoe',
          status: 'active',
          joinedAt: '2024-01-15',
          source: 'eventbrite',
          eventbriteId: '123456789'
        };

        const mockCommunity: Community = {
          id: communitySlug as string,
          name: 'Tech Innovators',
          slug: communitySlug as string,
          logo: `https://ui-avatars.com/api/?name=Tech+Innovators&size=100&background=4A6CF7&color=fff`,
          themeColor: colors.accent
        };

        setMember(mockMember);
        setCommunity(mockCommunity);
      } catch (error: any) {
        setError(error.message || 'Failed to load member profile');
      } finally {
        setLoading(false);
      }
    };

    if (communitySlug && memberSlug) {
      fetchMemberProfile();
    }
  }, [communitySlug, memberSlug]);

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    
    setSendingMessage(true);
    try {
      // In a real implementation, this would send the message via your API
      console.log('Sending message to:', member?.email, 'Message:', messageText);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessageText('');
      setShowMessageDialog(false);
      
      // Show success notification (you could use a toast library)
      alert('Message sent successfully!');
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0C] flex items-center justify-center">
        <div className="text-white text-lg">Loading member profile...</div>
      </div>
    );
  }

  if (error || !member || !community) {
    return (
      <div className="min-h-screen bg-[#0B0B0C] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-lg mb-4">{error || 'Member not found'}</div>
          <CustomButton
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Go Back
          </CustomButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-white">
      {/* Header */}
      <div className="bg-gray-900/50 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex items-center space-x-3">
              <img
                src={community.logo}
                alt={community.name}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-gray-300">{community.name}</span>
              <span className="text-gray-500">/</span>
              <span className="text-white font-medium">Member Profile</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-gray-900/30 rounded-2xl border border-gray-800 overflow-hidden">
          {/* Profile Header */}
          <div className="relative">
            <div 
              className="h-32 bg-gradient-to-r"
              style={{
                background: `linear-gradient(135deg, ${community.themeColor}40, ${community.themeColor}20)`
              }}
            />
            <div className="absolute -bottom-16 left-8">
              <img
                src={member.image}
                alt={`${member.firstName} ${member.lastName}`}
                className="w-32 h-32 rounded-full border-4 border-gray-900 bg-gray-900"
              />
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-20 px-8 pb-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {member.firstName} {member.lastName}
                </h1>
                <p className="text-gray-400 mb-4">{member.email}</p>
                
                {member.bio && (
                  <p className="text-gray-300 mb-6 max-w-2xl">{member.bio}</p>
                )}

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="text-gray-300">{member.email}</span>
                      </div>
                      {member.phone && (
                        <div className="flex items-center space-x-3">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span className="text-gray-300">{member.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Member Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-400">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          member.status === 'active' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {member.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-400">Joined:</span>
                        <span className="text-gray-300">{new Date(member.joinedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-400">Source:</span>
                        <span className="text-gray-300 capitalize">{member.source}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                {(member.linkedin || member.twitter) && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-white mb-4">Social Links</h3>
                    <div className="flex space-x-4">
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                          <span>LinkedIn</span>
                        </a>
                      )}
                      {member.twitter && (
                        <a
                          href={member.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                          </svg>
                          <span>Twitter</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Message Button */}
              <div className="ml-8">
                <CustomButton
                  type="button"
                  variant="form"
                  onClick={() => setShowMessageDialog(true)}
                  className="flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>Message</span>
                </CustomButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message Dialog */}
      {showMessageDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">
                  Send Message to {member.firstName}
                </h3>
                <button
                  onClick={() => setShowMessageDialog(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message here..."
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E0407B] focus:border-[#E0407B] resize-none"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <CustomButton
                  type="button"
                  variant="outline"
                  onClick={() => setShowMessageDialog(false)}
                  disabled={sendingMessage}
                >
                  Cancel
                </CustomButton>
                <CustomButton
                  type="button"
                  variant="form"
                  onClick={handleSendMessage}
                  disabled={!messageText.trim() || sendingMessage}
                >
                  {sendingMessage ? 'Sending...' : 'Send Message'}
                </CustomButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberProfilePage;
