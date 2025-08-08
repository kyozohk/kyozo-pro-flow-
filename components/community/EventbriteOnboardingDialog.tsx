"use client";

import React, { useState } from 'react';
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
  email: string;
  ticket_type: string;
  order_id: string;
}

const EventbriteOnboardingDialog: React.FC<EventbriteOnboardingDialogProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState<Step>('token');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [events, setEvents] = useState<EventbriteEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventbriteEvent | null>(null);
  const [attendees, setAttendees] = useState<EventbriteAttendee[]>([]);

  const handleTokenSubmit = async () => {
    if (!token.trim()) {
      setError('Please enter your Eventbrite API token');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/eventbrite/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      setEvents(data.events || []);
      setCurrentStep('events');
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to fetch events. Please check your token and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEventSelect = async (event: EventbriteEvent) => {
    setSelectedEvent(event);
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/eventbrite/attendees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, eventId: event.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch attendees');
      }

      const data = await response.json();
      setAttendees(data.attendees || []);
      
      // Console dump the Eventbrite data as requested in notes
      console.log('=== EVENTBRITE DATA DUMP ===');
      console.log('Selected Event:', event);
      console.log('Attendees Data:', data.attendees);
      console.log('Total Attendees:', data.attendees?.length || 0);
      console.log('=== END EVENTBRITE DATA DUMP ===');
      
      setCurrentStep('preview');
    } catch (error) {
      console.error('Error fetching attendees:', error);
      setError('Failed to fetch attendees. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    const importData = {
      source: 'eventbrite',
      event: selectedEvent,
      attendees: attendees,
      token: token
    };
    
    console.log('=== FINAL IMPORT DATA ===');
    console.log(importData);
    console.log('=== END FINAL IMPORT DATA ===');
    
    setCurrentStep('complete');
    setTimeout(() => {
      onComplete(importData);
    }, 2000);
  };

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

  const renderEventsStep = () => (
    <div className="w-full h-full flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12 p-6 lg:p-8">
      {/* Left Side - Event Selection */}
      <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left z-10">
        <p
          className="text-sm font-bold tracking-[0.2em] uppercase"
          style={{ color: colors.card.tagText, fontFamily: fonts.card }}
        >
          SELECT EVENT
        </p>
        <h2
          className="text-3xl lg:text-5xl font-bold leading-tight tracking-tighter"
          style={{ color: colors.card.headingText, fontFamily: fonts.card, letterSpacing: '-0.03em' }}
        >
          Choose Your Event
        </h2>
        <p 
          className="text-base lg:text-lg leading-relaxed"
          style={{ color: colors.card.bodyText, fontFamily: fonts.card }}
        >
          Select the event you want to import attendees from to create your community.
        </p>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {events.map((event) => (
            <div
              key={event.id}
              onClick={() => handleEventSelect(event)}
              className="p-4 bg-gradient-to-br from-orange-500/10 to-orange-600/20 border border-orange-500/30 rounded-xl cursor-pointer hover:border-orange-400/50 hover:bg-gradient-to-br hover:from-orange-500/15 hover:to-orange-600/25 transition-all duration-200"
            >
              <h3 className="text-lg font-semibold text-white mb-2">{event.name}</h3>
              <div className="text-sm text-gray-300 space-y-1">
                <p>Start: {new Date(event.start).toLocaleDateString()}</p>
                <p>Attendees: {event.attendee_count}</p>
              </div>
            </div>
          ))}
        </div>

        {loading && (
          <div className="flex items-center justify-center space-x-2 text-orange-400">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-orange-400"></div>
            <span>Loading attendees...</span>
          </div>
        )}
      </div>

      {/* Right Side - Event Preview */}
      <div className="w-full lg:w-1/2 relative overflow-hidden rounded-2xl">
        <div className="w-full h-full min-h-[400px] lg:min-h-[600px] bg-gradient-to-br from-orange-900/30 to-red-900/30 flex items-center justify-center">
          <div className="text-center text-white/90 p-8">
            <svg className="w-24 h-24 mx-auto mb-4 text-orange-400" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5a2.25 2.25 0 002.25-2.25m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5a2.25 2.25 0 012.25 2.25v7.5" />
            </svg>
            <p className="text-xl font-medium opacity-80">Select an Event</p>
            <p className="text-sm opacity-60">Choose from your Eventbrite events</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreviewStep = () => (
    <div className="w-full h-full flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12 p-6 lg:p-8">
      {/* Left Side - Attendee Preview */}
      <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left z-10">
        <p
          className="text-sm font-bold tracking-[0.2em] uppercase"
          style={{ color: colors.card.tagText, fontFamily: fonts.card }}
        >
          PREVIEW DATA
        </p>
        <h2
          className="text-3xl lg:text-5xl font-bold leading-tight tracking-tighter"
          style={{ color: colors.card.headingText, fontFamily: fonts.card, letterSpacing: '-0.03em' }}
        >
          Review Import
        </h2>
        <p 
          className="text-base lg:text-lg leading-relaxed"
          style={{ color: colors.card.bodyText, fontFamily: fonts.card }}
        >
          Review the attendee data from "{selectedEvent?.name}" before importing to your community.
        </p>

        <div className="space-y-4">
          <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
            <h4 className="text-green-300 font-semibold mb-2">Import Summary</h4>
            <div className="text-sm text-green-200 space-y-1">
              <p>Event: {selectedEvent?.name}</p>
              <p>Total Attendees: {attendees.length}</p>
              <p>Date: {selectedEvent ? new Date(selectedEvent.start).toLocaleDateString() : ''}</p>
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            <h4 className="text-white font-semibold mb-2">Attendees Preview:</h4>
            <div className="space-y-2">
              {attendees.slice(0, 10).map((attendee, index) => (
                <div key={attendee.id} className="p-2 bg-gray-800/50 rounded text-sm">
                  <div className="text-white">{attendee.name}</div>
                  <div className="text-gray-400">{attendee.email}</div>
                </div>
              ))}
              {attendees.length > 10 && (
                <div className="text-gray-400 text-sm text-center py-2">
                  ... and {attendees.length - 10} more attendees
                </div>
              )}
            </div>
          </div>

          <CustomButton
            onClick={handleComplete}
            disabled={loading}
            variant="primary"
          >
            Import {attendees.length} Attendees
          </CustomButton>
        </div>
      </div>

      {/* Right Side - Success Preview */}
      <div className="w-full lg:w-1/2 relative overflow-hidden rounded-2xl">
        <div className="w-full h-full min-h-[400px] lg:min-h-[600px] bg-gradient-to-br from-green-900/30 to-blue-900/30 flex items-center justify-center">
          <div className="text-center text-white/90 p-8">
            <svg className="w-24 h-24 mx-auto mb-4 text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
            <p className="text-xl font-medium opacity-80">Ready to Import</p>
            <p className="text-sm opacity-60">{attendees.length} attendees ready</p>
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
            <p>✓ {attendees.length} attendees imported</p>
            <p>✓ Community created from "{selectedEvent?.name}"</p>
            <p>✓ Data logged to console for review</p>
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
      case 'events':
        return renderEventsStep();
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
