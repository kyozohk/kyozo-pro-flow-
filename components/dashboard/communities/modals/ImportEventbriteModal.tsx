"use client";

import React, { useState } from 'react';
import { colors, borderRadius, fontWeights, fontSizes } from '../../../../styles/theme';
import Dialog from '../../../Dialog';
import CustomInput from '../../../CustomInput';
import CustomButton from '../../../CustomButton';

interface ImportEventbriteModalProps {
  onClose: () => void;
  onImport: (members: any[]) => void;
  communityId: string;
}

const ImportEventbriteModal: React.FC<ImportEventbriteModalProps> = ({ onClose, onImport, communityId }) => {
  const [eventUrl, setEventUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'credentials' | 'preview'>('credentials');
  const [previewData, setPreviewData] = useState<any[]>([]);

  const handleFetchEventData = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eventUrl.trim() || !apiKey.trim()) {
      setError('Please provide both the Eventbrite event URL and API key');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // In a real implementation, this would be an API call to Eventbrite
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data
      const mockAttendees = [
        {
          id: 'eb-101',
          name: 'Michael Johnson',
          email: 'michael.johnson@example.com',
          phone: '+1987654321',
          status: 'inactive',
          joinedAt: new Date().toISOString()
        },
        {
          id: 'eb-102',
          name: 'Sarah Williams',
          email: 'sarah.williams@example.com',
          phone: '+1876543210',
          status: 'inactive',
          joinedAt: new Date().toISOString()
        },
        {
          id: 'eb-103',
          name: 'David Brown',
          email: 'david.brown@example.com',
          status: 'inactive',
          joinedAt: new Date().toISOString()
        }
      ];
      
      setPreviewData(mockAttendees);
      setStep('preview');
    } catch (err) {
      setError('Failed to fetch event data. Please check your API key and event URL.');
      console.error('Error fetching Eventbrite data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async () => {
    setIsLoading(true);
    
    try {
      // In a real implementation, this would save to Firebase and send invites
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onImport(previewData);
    } catch (err) {
      setError('Failed to import members. Please try again.');
      console.error('Error importing members:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog isOpen={true} onClose={onClose} title="Import from Eventbrite">
      {step === 'credentials' ? (
        <form onSubmit={handleFetchEventData} className="space-y-6">
          {error && (
            <div className={`bg-red-900/20 border border-red-500/50 text-red-100 p-4 ${borderRadius.md}`}>
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="eventUrl" className={`block mb-2 text-[${colors.textPrimary}] ${fontWeights.medium}`}>
              Eventbrite Event URL
            </label>
            <CustomInput
              id="eventUrl"
              type="text"
              value={eventUrl}
              onChange={(e) => setEventUrl(e.target.value)}
              placeholder="https://www.eventbrite.com/e/your-event-id"
              required
            />
            <p className={`mt-1 text-xs text-[${colors.textSecondary}]`}>
              Enter the URL of your Eventbrite event
            </p>
          </div>
          
          <div>
            <label htmlFor="apiKey" className={`block mb-2 text-[${colors.textPrimary}] ${fontWeights.medium}`}>
              Eventbrite API Key
            </label>
            <CustomInput
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Your Eventbrite API key"
              required
            />
            <p className={`mt-1 text-xs text-[${colors.textSecondary}]`}>
              You can find your API key in your Eventbrite account settings
            </p>
          </div>
          
          <div className="flex justify-end space-x-4 pt-4">
            <CustomButton
              type="button"
              variant="text"
              onClick={onClose}
              className={`text-[${colors.textSecondary}]`}
            >
              Cancel
            </CustomButton>
            <CustomButton
              type="submit"
              variant="primary"
              className={`${borderRadius.full} px-6`}
              disabled={isLoading}
            >
              {isLoading ? 'Connecting...' : 'Connect to Eventbrite'}
            </CustomButton>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          {error && (
            <div className={`bg-red-900/20 border border-red-500/50 text-red-100 p-4 ${borderRadius.md}`}>
              {error}
            </div>
          )}
          
          <div>
            <h3 className={`text-[${colors.textPrimary}] ${fontWeights.semibold} mb-2`}>
              {previewData.length} attendees found
            </h3>
            <p className={`text-[${colors.textSecondary}] text-sm mb-4`}>
              Review the attendees below before importing. All attendees will receive an email invitation to join your community.
            </p>
            
            <div className={`bg-[${colors.bgDarker}] ${borderRadius.md} border border-[${colors.borderDark}] max-h-64 overflow-y-auto`}>
              <table className="w-full">
                <thead className={`bg-[${colors.borderDark}] text-[${colors.textPrimary}] text-sm sticky top-0`}>
                  <tr>
                    <th className="text-left py-2 px-4">Name</th>
                    <th className="text-left py-2 px-4">Email</th>
                    <th className="text-left py-2 px-4">Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((attendee) => (
                    <tr key={attendee.id} className={`border-t border-[${colors.borderDark}]`}>
                      <td className={`py-2 px-4 text-[${colors.textPrimary}] text-sm`}>{attendee.name}</td>
                      <td className={`py-2 px-4 text-[${colors.textSecondary}] text-sm`}>{attendee.email}</td>
                      <td className={`py-2 px-4 text-[${colors.textSecondary}] text-sm`}>{attendee.phone || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4 pt-4">
            <CustomButton
              type="button"
              variant="text"
              onClick={() => setStep('credentials')}
              className={`text-[${colors.textSecondary}]`}
              disabled={isLoading}
            >
              Back
            </CustomButton>
            <CustomButton
              type="button"
              variant="primary"
              className={`${borderRadius.full} px-6`}
              onClick={handleImport}
              disabled={isLoading}
            >
              {isLoading ? 'Importing...' : 'Import & Send Invites'}
            </CustomButton>
          </div>
        </div>
      )}
    </Dialog>
  );
};

export default ImportEventbriteModal;
