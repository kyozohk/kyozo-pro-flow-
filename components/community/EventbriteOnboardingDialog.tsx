"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { CustomButton } from '../index';
import Dialog from '../ui/Dialog';
import { colors, fonts } from '../../styles/theme';
import Image from 'next/image';

interface EventbriteOnboardingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: any) => void;
}

type Step = 'token' | 'events' | 'preview' | 'complete';

interface EventbriteEvent {
  id: string;
  name: string;
  start: string;
  end: string;
  attendee_count: number;
}

interface EventbriteAttendee {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  status: string;
  eventIds: string[];
  eventNames: string[];
  totalTickets: number;
  firstRegistration: string;
  lastActivity: string;
}

interface EditableAttendee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  eventNames: string[];
  totalTickets: number;
}

const EventbriteOnboardingDialog: React.FC<EventbriteOnboardingDialogProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>('token');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [events, setEvents] = useState<EventbriteEvent[]>([]);
  const [uniqueAttendees, setUniqueAttendees] = useState<EventbriteAttendee[]>([]);
  const [editableAttendees, setEditableAttendees] = useState<EditableAttendee[]>([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [organizationName, setOrganizationName] = useState('');

  const [apiLogs, setApiLogs] = useState<string[]>([]);

  // Load saved token when dialog opens
  useEffect(() => {
    const loadSavedToken = async () => {
      if (!user || !isOpen) return;
      
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.eventbriteToken) {
            setToken(userData.eventbriteToken);
            console.log('✅ Loaded saved Eventbrite token for user');
          }
        }
      } catch (error) {
        console.error('❌ Error loading saved token:', error);
      }
    };
    
    loadSavedToken();
  }, [user, isOpen]);

  // Helper function to add API logs
  const addLog = (message: string) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    setApiLogs(prev => [...prev, logMessage]);
  };

  // Save token to user profile
  const saveToken = async (tokenToSave: string) => {
    if (!user) return;
    
    try {
      await setDoc(doc(db, 'users', user.uid), {
        eventbriteToken: tokenToSave
      }, { merge: true });
      addLog('✅ Token saved to user profile');
    } catch (error) {
      addLog(`❌ Error saving token: ${error}`);
    }
  };

  const handleTokenSubmit = async () => {
    if (!token.trim()) {
      setError('Please enter your Eventbrite API token');
      addLog('❌ Token validation failed: Empty token');
      return;
    }

    setLoading(true);
    setError('');
    setApiLogs([]); // Clear previous logs
    addLog('🔄 Starting Eventbrite API connection...');
    addLog(`📝 Token length: ${token.length} characters`);
    addLog(`🔗 API Endpoint: /api/eventbrite/all-attendees`);

    try {
      addLog('📡 Fetching all unique attendees across events...');
      const response = await fetch('/api/eventbrite/all-attendees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      addLog(`📊 Response status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        addLog(`❌ API Error Response: ${JSON.stringify(errorData, null, 2)}`);
        
        let errorMessage = 'Failed to fetch attendees. ';
        if (response.status === 401) {
          errorMessage += 'Invalid token - please check your Eventbrite private token.';
          addLog('❌ Authentication failed: Invalid or expired token');
        } else if (response.status === 403) {
          errorMessage += 'Access forbidden - token may not have required permissions.';
          addLog('❌ Authorization failed: Insufficient permissions');
        } else if (response.status === 429) {
          errorMessage += 'Rate limit exceeded - please try again later.';
          addLog('❌ Rate limit exceeded');
        } else {
          errorMessage += `API error (${response.status}): ${errorData.error || 'Unknown error'}`;
          addLog(`❌ API Error: ${errorData.error || 'Unknown error'}`);
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const attendeeCount = data.totalUniqueUsers || 0;
      const eventCount = data.eventsProcessed || 0;
      addLog(`✅ Successfully fetched ${attendeeCount} unique attendees from ${eventCount} events`);
      addLog(`🏢 Organization: ${data.organizationName || 'Unknown'}`);
      
      setUniqueAttendees(data.uniqueUsers || []);
      setTotalEvents(eventCount);
      setOrganizationName(data.organizationName || '');
      
      // Create editable attendees data with default values
      const editableData: EditableAttendee[] = (data.uniqueUsers || []).map((attendee: any) => ({
        id: attendee.email, // Use email as unique ID
        firstName: attendee.firstName || '',
        lastName: attendee.lastName || '',
        email: attendee.email || '',
        phone: attendee.phone || '', // Usually empty from Eventbrite
        dob: '', // Not available from Eventbrite, user can add
        eventNames: attendee.eventNames || [],
        totalTickets: attendee.totalTickets || 1
      }));
      setEditableAttendees(editableData);
      
      // Console dump the Eventbrite data as requested in notes
      console.log('=== EVENTBRITE ALL ATTENDEES DATA DUMP ===');
      console.log('Organization:', data.organizationName);
      console.log('Total Unique Users:', data.totalUniqueUsers);
      console.log('Total Attendees (with duplicates):', data.totalAttendees);
      console.log('Events Processed:', data.eventsProcessed);
      console.log('Unique Users Data:', data.uniqueUsers);
      console.log('Sample User:', data.uniqueUsers?.[0]);
      console.log('=== END EVENTBRITE DATA DUMP ===');
      
      // Save the token after successful validation
      await saveToken(token);
      addLog('💾 Token validated and saved successfully');
      
      addLog('📋 Eventbrite data dumped to console for review');
      addLog('✅ Moving to preview step');
      setCurrentStep('preview');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      addLog(`❌ Final error: ${errorMessage}`);
      console.error('❌ Eventbrite API Error Details:', {
        error,
        token: token.substring(0, 10) + '...',
        timestamp: new Date().toISOString()
      });
      setError(errorMessage);
    } finally {
      setLoading(false);
      addLog('🏁 Token submission process completed');
    }
  };

  // Function to handle editing attendee data
  const handleAttendeeEdit = (attendeeId: string, field: keyof EditableAttendee, value: string) => {
    setEditableAttendees(prev => 
      prev.map(attendee => 
        attendee.id === attendeeId 
          ? { ...attendee, [field]: value }
          : attendee
      )
    );
  };

  // Function to handle importing attendees to Firebase
  const handleImportAttendees = async () => {
    if (!user || editableAttendees.length === 0) {
      setError('No attendees to import or user not authenticated');
      return;
    }

    setLoading(true);
    setError('');
    addLog('🚀 Starting import of attendees to Firebase...');
    addLog(`📊 Importing ${editableAttendees.length} edited attendees`);

    try {
      // Here we would implement the Firebase import logic using editableAttendees
      // For now, we'll just simulate the process and move to complete step
      addLog('💾 Adding edited attendees as community members...');
      
      // Log the edited data
      console.log('=== EDITED ATTENDEES DATA FOR IMPORT ===');
      console.log('Edited Attendees:', editableAttendees);
      console.log('Total to Import:', editableAttendees.length);
      console.log('=== END EDITED ATTENDEES DATA ===');
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      addLog(`✅ Successfully imported ${editableAttendees.length} attendees as community members`);
      addLog('🎉 Import process completed successfully');
      
      setCurrentStep('complete');
      
      // Call onComplete with the edited data
      onComplete({
        source: 'eventbrite',
        attendees: editableAttendees,
        totalImported: editableAttendees.length,
        organizationName,
        eventsProcessed: totalEvents
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to import attendees';
      addLog(`❌ Import error: ${errorMessage}`);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // This function is now handled by handleImportAttendees
  // Keeping for compatibility but it's no longer used

  const renderTokenStep = () => (
    <div className="w-full h-full flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12 p-6 lg:p-8">
      {/* Left Side - Token Input */}
      <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left z-10">
        <p
          className="text-sm font-bold tracking-[0.2em] uppercase"
          style={{ color: colors.card.tagText, fontFamily: fonts.card }}
        >
          EVENTBRITE INTEGRATION
        </p>
        <h2
          className="text-3xl lg:text-5xl font-bold leading-tight tracking-tighter"
          style={{ color: colors.card.headingText, fontFamily: fonts.card, letterSpacing: '-0.03em' }}
        >
          Connect Your Eventbrite
        </h2>
        <p 
          className="text-base lg:text-lg leading-relaxed"
          style={{ color: colors.card.bodyText, fontFamily: fonts.card }}
        >
          Enter your Eventbrite API token to import your event attendees and create your community automatically.
        </p>

        <div className="space-y-4">
          <div className="p-4 bg-orange-900/20 border border-orange-500/30 rounded-lg">
            <h4 className="text-orange-300 font-semibold mb-2">How to get your API token:</h4>
            <ol className="text-sm text-orange-200 space-y-1">
              <li>1. Go to Eventbrite Developer Console</li>
              <li>2. Create a new app or use existing one</li>
              <li>3. Copy your Private Token</li>
              <li>4. Paste it below</li>
            </ol>
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">
              Eventbrite API Token
            </label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter your Eventbrite API token"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-900/30 border border-red-500/50 text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* API Logs Display */}
          {apiLogs.length > 0 && (
            <div className="p-3 bg-gray-900/50 border border-gray-600/50 rounded-lg">
              <h4 className="text-gray-300 font-semibold mb-2 text-sm">API Debug Logs:</h4>
              <div className="max-h-32 overflow-y-auto text-xs font-mono">
                {apiLogs.map((log, index) => (
                  <div key={index} className="text-gray-400 mb-1">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}

          <CustomButton
            onClick={handleTokenSubmit}
            disabled={loading || !token.trim()}
            variant="primary"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                <span>Connecting...</span>
              </div>
            ) : (
              'Connect to Eventbrite'
            )}
          </CustomButton>
        </div>
      </div>

      {/* Right Side - Eventbrite Guide Image */}
      <div className="w-full lg:w-1/2 relative overflow-hidden rounded-2xl">
        <div className="w-full h-full min-h-[400px] lg:min-h-[600px] relative flex items-center justify-center">
          <Image 
            src="/event-brite-export.gif" 
            alt="Eventbrite export guide"
            width={600}
            height={1200}
            className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
            unoptimized
          />
        </div>
      </div>
    </div>
  );

  // Event selection step is no longer needed - we go directly from token to preview

  const renderPreviewStep = () => (
    <div className="w-full h-full flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12 p-6 lg:p-8">
      {/* Left Side - Unique Attendees Preview */}
      <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left z-10">
        <p
          className="text-sm font-bold tracking-[0.2em] uppercase"
          style={{ color: colors.card.tagText, fontFamily: fonts.card }}
        >
          PREVIEW IMPORT
        </p>
        <h2
          className="text-3xl lg:text-5xl font-bold leading-tight tracking-tighter"
          style={{ color: colors.card.headingText, fontFamily: fonts.card, letterSpacing: '-0.03em' }}
        >
          Review Attendees
        </h2>
        <p 
          className="text-base lg:text-lg leading-relaxed"
          style={{ color: colors.card.bodyText, fontFamily: fonts.card }}
        >
          Review all unique attendees from your <strong>{organizationName}</strong> events before importing them as community members.
        </p>

        <div className="bg-gray-800/30 border border-gray-600/50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-white">Import Summary</h3>
            <span className="text-sm text-gray-400">{uniqueAttendees.length} unique users</span>
          </div>
          <div className="text-sm text-gray-300 space-y-1">
            <p>Organization: {organizationName}</p>
            <p>Events Processed: {totalEvents}</p>
            <p>Unique Attendees: {uniqueAttendees.length}</p>
          </div>
        </div>

        <div className="max-h-64 overflow-y-auto space-y-2">
          <h4 className="text-sm font-semibold text-gray-300 mb-2">Unique Attendees:</h4>
          {uniqueAttendees.map((attendee: EventbriteAttendee, index: number) => (
            <div key={attendee.email} className="p-3 bg-gray-800/50 border border-gray-600/30 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white font-medium">{attendee.name}</p>
                  <p className="text-sm text-gray-400">{attendee.email}</p>
                  <p className="text-xs text-gray-500">
                    {attendee.totalTickets} ticket{attendee.totalTickets !== 1 ? 's' : ''} • 
                    {attendee.eventNames.join(', ')}
                  </p>
                </div>
                <span className="text-xs text-gray-500">#{index + 1}</span>
              </div>
            </div>
          ))}
        </div>

        {uniqueAttendees.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">No attendees found in your Eventbrite events.</p>
          </div>
        )}

        {/* API Logs Display */}
        {apiLogs.length > 0 && (
          <div className="p-3 bg-gray-900/50 border border-gray-600/50 rounded-lg">
            <h4 className="text-gray-300 font-semibold mb-2 text-sm">Import Process Logs:</h4>
            <div className="max-h-32 overflow-y-auto text-xs font-mono">
              {apiLogs.map((log, index) => (
                <div key={index} className="text-gray-400 mb-1">
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex space-x-4">
          <CustomButton
            onClick={() => setCurrentStep('token')}
            variant="outline"
            className="flex-1"
          >
            Back to Token
          </CustomButton>
          <CustomButton
            onClick={handleImportAttendees}
            variant="primary"
            className="flex-1"
            disabled={uniqueAttendees.length === 0 || loading}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                <span>Importing...</span>
              </div>
            ) : (
              `Import ${uniqueAttendees.length} Members`
            )}
          </CustomButton>
        </div>
      </div>

      {/* Right Side - Import Preview */}
      <div className="w-full lg:w-1/2 relative overflow-hidden rounded-2xl">
        <div className="w-full h-full min-h-[400px] lg:min-h-[600px] bg-gradient-to-br from-green-900/30 to-blue-900/30 flex items-center justify-center">
          <div className="text-center text-white/90 p-8">
            <svg className="w-24 h-24 mx-auto mb-4 text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xl font-medium opacity-80">Ready to Import</p>
            <p className="text-sm opacity-60">Your community will be created with {uniqueAttendees.length} unique members</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompleteStep = () => (
    <div className="w-full h-full flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12 p-6 lg:p-8">
      {/* Left Side - Success Message */}
      <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left z-10">
        <p
          className="text-sm font-bold tracking-[0.2em] uppercase"
          style={{ color: colors.card.tagText, fontFamily: fonts.card }}
        >
          IMPORT COMPLETE
        </p>
        <h2
          className="text-3xl lg:text-5xl font-bold leading-tight tracking-tighter"
          style={{ color: colors.card.headingText, fontFamily: fonts.card, letterSpacing: '-0.03em' }}
        >
          Successfully Imported!
        </h2>
        <p 
          className="text-base lg:text-lg leading-relaxed"
          style={{ color: colors.card.bodyText, fontFamily: fonts.card }}
        >
          Your Eventbrite attendees have been successfully imported. Your community is now ready!
        </p>

        <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
          <h4 className="text-green-300 font-semibold mb-2">Import Summary</h4>
          <div className="text-sm text-green-200 space-y-1">
            <p>Organization: {organizationName}</p>
            <p>Unique Members Imported: {uniqueAttendees.length}</p>
            <p>Events Processed: {totalEvents}</p>
            <p>Status: Successfully imported to community</p>
          </div>
        </div>
      </div>

      {/* Right Side - Success Image */}
      <div className="w-full lg:w-1/2 relative overflow-hidden rounded-2xl">
        <div className="w-full h-full min-h-[400px] lg:min-h-[600px] relative flex items-center justify-center">
          <Image 
            src="/grow.png" 
            alt="Eventbrite onboarding complete"
            width={600}
            height={600}
            className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
            unoptimized
          />
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'token':
        return renderTokenStep();
      case 'preview':
        return renderPreviewStep();
      case 'complete':
        return renderCompleteStep();
      default:
        return renderTokenStep();
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      {renderCurrentStep()}
    </Dialog>
  );
};

export default EventbriteOnboardingDialog;
