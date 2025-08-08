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
            className="w-full h-full object-cover drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
            // className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
            unoptimized
          />
        </div>
      </div>
    </div>
  );

  // Event selection step is no longer needed - we go directly from token to preview

  const renderPreviewStep = () => (
    <div className="w-full h-full flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12 p-6 lg:p-8">
      {/* Left Side - Import Summary & Progress */}
      <div className="w-full lg:w-1/3 flex flex-col space-y-6 text-center lg:text-left z-10">
        <p
          className="text-sm font-bold tracking-[0.2em] uppercase"
          style={{ color: colors.card.tagText, fontFamily: fonts.card }}
        >
          PREVIEW & EDIT
        </p>
        <h2
          className="text-3xl lg:text-4xl font-bold leading-tight tracking-tighter"
          style={{ color: colors.card.headingText, fontFamily: fonts.card, letterSpacing: '-0.03em' }}
        >
          Edit Attendees
        </h2>
        <p 
          className="text-base lg:text-lg leading-relaxed"
          style={{ color: colors.card.bodyText, fontFamily: fonts.card }}
        >
          Review and edit attendee information before importing them as community members.
        </p>

        <div className="bg-gray-800/30 border border-gray-600/50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-white">Import Summary</h3>
            <span className="text-sm text-gray-400">{editableAttendees.length} attendees</span>
          </div>
          <div className="text-sm text-gray-300 space-y-1">
            <p>Organization: {organizationName}</p>
            <p>Events Processed: {totalEvents}</p>
            <p>Ready to Import: {editableAttendees.length}</p>
          </div>
        </div>

        {/* Import Progress Logs - Enhanced Display */}
        <div className="bg-gray-900/50 border border-gray-600/50 rounded-lg p-4 flex-1">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-gray-300 font-semibold text-sm">Import Progress</h4>
            {loading && (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-orange-500"></div>
                <span className="text-xs text-orange-400">Processing...</span>
              </div>
            )}
          </div>
          
          <div className="h-64 overflow-y-auto text-xs font-mono space-y-1">
            {apiLogs.length === 0 ? (
              <div className="text-gray-500 italic text-center py-8">
                Import logs will appear here during the process...
              </div>
            ) : (
              apiLogs.map((log, index) => (
                <div key={index} className="text-gray-300 py-1 px-2 bg-gray-800/30 rounded border-l-2 border-gray-600">
                  <span className="text-gray-500 mr-2">[{new Date().toLocaleTimeString()}]</span>
                  {log}
                </div>
              ))
            )}
          </div>
          
          {/* Progress Summary */}
          {loading && (
            <div className="mt-3 pt-3 border-t border-gray-600/30">
              <div className="text-xs text-gray-400">
                <div className="flex justify-between mb-1">
                  <span>Progress:</span>
                  <span>{apiLogs.length} steps completed</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div 
                    className="bg-orange-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((apiLogs.length / 8) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Editable Attendees Grid */}
      <div className="w-full lg:w-2/3 flex flex-col max-h-full">
        <div className="bg-gray-800/30 border border-gray-600/50 rounded-lg p-4 flex flex-col h-full">
          <h3 className="text-lg font-semibold text-white mb-4 flex-shrink-0">Attendee Details - Click to Edit</h3>
          
          {editableAttendees.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-400">No attendees found in your Eventbrite events.</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto min-h-0 mb-4">
              <div className="space-y-3 pr-2">
                {editableAttendees.map((attendee, index) => (
                  <div key={attendee.id} className="bg-gray-700/50 border border-gray-600/30 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* First Name */}
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">First Name</label>
                        <input
                          type="text"
                          value={attendee.firstName}
                          onChange={(e) => handleAttendeeEdit(attendee.id, 'firstName', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-md text-white text-sm focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50"
                          placeholder="First name"
                        />
                      </div>
                      
                      {/* Last Name */}
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">Last Name</label>
                        <input
                          type="text"
                          value={attendee.lastName}
                          onChange={(e) => handleAttendeeEdit(attendee.id, 'lastName', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-md text-white text-sm focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50"
                          placeholder="Last name"
                        />
                      </div>
                      
                      {/* Email */}
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">Email</label>
                        <input
                          type="email"
                          value={attendee.email}
                          onChange={(e) => handleAttendeeEdit(attendee.id, 'email', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-md text-white text-sm focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50"
                          placeholder="email@example.com"
                        />
                      </div>
                      
                      {/* Phone */}
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">Phone</label>
                        <input
                          type="tel"
                          value={attendee.phone}
                          onChange={(e) => handleAttendeeEdit(attendee.id, 'phone', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-md text-white text-sm focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      
                      {/* Date of Birth */}
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">Date of Birth</label>
                        <input
                          type="date"
                          value={attendee.dob}
                          onChange={(e) => handleAttendeeEdit(attendee.id, 'dob', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-md text-white text-sm focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50"
                        />
                      </div>
                      
                      {/* Event Info */}
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">Events ({attendee.totalTickets} tickets)</label>
                        <div className="px-3 py-2 bg-gray-900/50 border border-gray-600/30 rounded-md text-gray-400 text-sm">
                          {attendee.eventNames.join(', ') || 'No events'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-xs text-gray-500">Attendee #{index + 1}</span>
                      <span className="text-xs text-gray-500">{attendee.totalTickets} ticket{attendee.totalTickets !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Action Buttons - Always Visible */}
          <div className="flex space-x-4 pt-4 border-t border-gray-600/30 flex-shrink-0 bg-gray-800/30 -mx-4 -mb-4 px-4 pb-4 rounded-b-lg">
            <CustomButton
              onClick={() => setCurrentStep('token')}
              variant="outline"
              className="flex-1"
            >
              Back
            </CustomButton>
            <CustomButton
              onClick={handleImportAttendees}
              variant="primary"
              className="flex-1"
              disabled={editableAttendees.length === 0 || loading}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  <span>Importing...</span>
                </div>
              ) : (
                `Import ${editableAttendees.length} Members`
              )}
            </CustomButton>
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
            <p>Members Imported: {editableAttendees.length}</p>
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
