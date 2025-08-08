"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import { parseCSV, validateCSVFile } from '../../lib/csvParser';
import Dialog from '../Dialog';
import { CustomButton } from '../index';
import { colors } from '../../styles/theme';
import CommunityForm from './CommunityForm';

export enum CommunityCreationMethod {
  CSV_IMPORT = 'csv_import',
  EVENTBRITE_IMPORT = 'eventbrite_import',
  MANUAL_CREATION = 'manual_creation'
}

export enum CommunityStep {
  METHOD_SELECTION = 'method_selection',
  CSV_UPLOAD = 'csv_upload',
  EVENTBRITE_TOKEN = 'eventbrite_token',
  MANUAL_FORM = 'manual_form'
}

interface CommunityOnboardingDialogProps {
  onClose: () => void;
  onCommunityCreated: () => void;
}

const CommunityOnboardingDialog: React.FC<CommunityOnboardingDialogProps> = ({
  onClose,
  onCommunityCreated
}) => {
  const [currentStep, setCurrentStep] = useState<CommunityStep>(CommunityStep.METHOD_SELECTION);
  const [selectedMethod, setSelectedMethod] = useState<CommunityCreationMethod | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form data
  const [communityData, setCommunityData] = useState({
    name: '',
    location: '',
    logo: null as File | null,
    backgroundImage: null as File | null,
    isPrivate: false,
    allowReferrals: true,
    isVisible: true,
    themeColor: colors.accent
  });
  
  const [eventbriteToken, setEventbriteToken] = useState('');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [eventbriteEvents, setEventbriteEvents] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [fetchingEvents, setFetchingEvents] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [csvMembers, setCsvMembers] = useState<any[]>([]);
  const [importingMembers, setImportingMembers] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { user } = useAuth();

  const themeColors = [
    { name: 'Pink', value: colors.accent, class: 'bg-pink-500' },
    { name: 'Purple', value: colors.svg.purple, class: 'bg-purple-500' },
    { name: 'Blue', value: colors.secondary, class: 'bg-blue-500' },
    { name: 'Teal', value: colors.svg.teal, class: 'bg-teal-500' },
    { name: 'Orange', value: colors.svg.orange, class: 'bg-orange-500' },
  ];

  const handleMethodSelect = (method: CommunityCreationMethod) => {
    setSelectedMethod(method);
    switch (method) {
      case CommunityCreationMethod.CSV_IMPORT:
        setCurrentStep(CommunityStep.CSV_UPLOAD);
        break;
      case CommunityCreationMethod.EVENTBRITE_IMPORT:
        setCurrentStep(CommunityStep.EVENTBRITE_TOKEN);
        break;
      case CommunityCreationMethod.MANUAL_CREATION:
        setCurrentStep(CommunityStep.MANUAL_FORM);
        break;
    }
  };



  const handleCommunitySubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      if (!communityData.name.trim()) {
        throw new Error('Community name is required');
      }
      
      // Create community first
      console.log('Creating community with data:', {
        ...communityData,
        method: selectedMethod,
        eventbriteToken: selectedMethod === CommunityCreationMethod.EVENTBRITE_IMPORT ? eventbriteToken : null,
        csvFile: selectedMethod === CommunityCreationMethod.CSV_IMPORT ? csvFile : null
      });
      
      // Simulate community creation API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // If Eventbrite import, fetch and import members
      if (selectedMethod === CommunityCreationMethod.EVENTBRITE_IMPORT && eventbriteToken && selectedEventId) {
        try {
          // Fetch attendees from selected event
          const attendeesResponse = await fetch('/api/eventbrite/attendees', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              token: eventbriteToken, 
              eventId: selectedEventId 
            }),
          });
          
          const attendeesData = await attendeesResponse.json();
          
          if (attendeesResponse.ok && attendeesData.attendees) {
            // Import attendees as community members
            const importResponse = await fetch('/api/eventbrite/import', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                userId: 'current-user-id', // Replace with actual user ID
                communityId: 'new-community-id', // Replace with actual community ID
                attendees: attendeesData.attendees
              }),
            });
            
            const importResult = await importResponse.json();
            
            if (importResponse.ok) {
              console.log(`Successfully imported ${importResult.imported} members from Eventbrite`);
            } else {
              console.warn('Failed to import some members:', importResult.error);
            }
          }
        } catch (importError) {
          console.error('Error importing Eventbrite members:', importError);
          // Don't fail the whole process if member import fails
        }
      }
      
      onCommunityCreated();
    } catch (error: any) {
      setError(error.message || 'Failed to create community');
    } finally {
      setLoading(false);
    }
  };

  const renderMethodSelection = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-3xl font-semibold text-white mb-4">Create Your First Community</h3>
        <p className="text-gray-300 mb-8">Choose how you'd like to set up your community</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CSV Import */}
        <div 
          onClick={() => handleMethodSelect(CommunityCreationMethod.CSV_IMPORT)}
          className="p-8 bg-gray-800/50 border border-gray-600 rounded-xl hover:border-[#E0407B] cursor-pointer transition-all duration-300 group"
        >
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
            </div>
            <h4 className="text-xl font-semibold text-white mb-3">Import from CSV</h4>
            <p className="text-gray-400">Upload a CSV file with your member data</p>
          </div>
        </div>

        {/* Eventbrite Import */}
        <div 
          onClick={() => handleMethodSelect(CommunityCreationMethod.EVENTBRITE_IMPORT)}
          className="p-8 bg-gray-800/50 border border-gray-600 rounded-xl hover:border-[#E0407B] cursor-pointer transition-all duration-300 group"
        >
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-600 to-purple-500 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <h4 className="text-xl font-semibold text-white mb-3">Import from Eventbrite</h4>
            <p className="text-gray-400">Connect your Eventbrite account</p>
          </div>
        </div>

        {/* Manual Creation */}
        <div 
          onClick={() => handleMethodSelect(CommunityCreationMethod.MANUAL_CREATION)}
          className="p-8 bg-gray-800/50 border border-gray-600 rounded-xl hover:border-[#E0407B] cursor-pointer transition-all duration-300 group"
        >
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-teal-600 to-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h4 className="text-xl font-semibold text-white mb-3">Create Manually</h4>
            <p className="text-gray-400">Set up your community from scratch</p>
          </div>
        </div>
      </div>
    </div>
  );

  const getDialogTitle = () => {
    switch (currentStep) {
      case CommunityStep.METHOD_SELECTION:
        return 'Create Community';
      case CommunityStep.CSV_UPLOAD:
        return 'Upload CSV';
      case CommunityStep.EVENTBRITE_TOKEN:
        return 'Connect Eventbrite';
      case CommunityStep.MANUAL_FORM:
        return 'Community Profile';
      default:
        return 'Create Community';
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setCsvFile(file);
        setError('');
        
        // Parse CSV and log the data (same as file select)
        try {
          console.log('📄 CSV File Dropped:', {
            name: file.name,
            size: `${(file.size / 1024).toFixed(1)} KB`,
            type: file.type
          });
          
          const fileContent = await file.text();
          const parseResult = parseCSV(fileContent);
          console.log('📊 CSV Parse Result:', parseResult);
          
          if (parseResult.members && parseResult.members.length > 0) {
            setCsvMembers(parseResult.members);
            console.log(`👥 Found ${parseResult.members.length} members in CSV`);
            console.log('👤 Sample Member:', parseResult.members[0]);
          } else {
            console.warn('⚠️ No valid members found in CSV');
          }
        } catch (parseError: any) {
          console.error('❌ CSV Parse Error:', parseError);
          setError(parseError.message || 'Failed to parse CSV file');
        }
      } else {
        setError('Please upload a CSV file');
      }
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setCsvFile(file);
        setError('');
        
        // Parse CSV and log the data
        try {
          console.log('📄 CSV File Selected:', {
            name: file.name,
            size: `${(file.size / 1024).toFixed(1)} KB`,
            type: file.type
          });
          
          const fileContent = await file.text();
          const parseResult = parseCSV(fileContent);
          console.log('📊 CSV Parse Result:', parseResult);
          
          if (parseResult.members && parseResult.members.length > 0) {
            setCsvMembers(parseResult.members);
            console.log(`👥 Found ${parseResult.members.length} members in CSV`);
            console.log('👤 Sample Member:', parseResult.members[0]);
          } else {
            console.warn('⚠️ No valid members found in CSV');
          }
        } catch (parseError: any) {
          console.error('❌ CSV Parse Error:', parseError);
          setError(parseError.message || 'Failed to parse CSV file');
        }
      } else {
        setError('Please upload a CSV file');
      }
    }
  };

  const handleEventbriteTokenSubmit = async () => {
    if (!eventbriteToken.trim()) {
      setError('Please enter your Eventbrite private token');
      return;
    }
    
    setFetchingEvents(true);
    setError('');
    
    try {
      // Fetch user's events from Eventbrite
      const response = await fetch('/api/eventbrite/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: eventbriteToken }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch events');
      }
      
      console.log('🎫 Eventbrite Events Data:', data);
      
      if (data.events && data.events.length > 0) {
        setEventbriteEvents(data.events);
        
        // Auto-select first event and fetch its attendees
        const firstEvent = data.events[0];
        setSelectedEventId(firstEvent.id);
        
        console.log('📅 Selected Event:', firstEvent);
        
        // Fetch attendees for the selected event
        try {
          const attendeesResponse = await fetch('/api/eventbrite/attendees', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              token: eventbriteToken, 
              eventId: firstEvent.id 
            }),
          });
          
          const attendeesData = await attendeesResponse.json();
          
          if (attendeesResponse.ok) {
            console.log('👥 Eventbrite Attendees Data:', attendeesData);
            console.log(`📊 Found ${attendeesData.attendees?.length || 0} attendees for event: ${firstEvent.name}`);
            
            // Store attendees data for later use (but don't import to Firebase yet)
            setCsvMembers(attendeesData.attendees || []);
            
            // Log sample attendee data for debugging
            if (attendeesData.attendees && attendeesData.attendees.length > 0) {
              console.log('👤 Sample Attendee:', attendeesData.attendees[0]);
            }
          } else {
            console.error('❌ Failed to fetch attendees:', attendeesData.error);
            setError(`Failed to fetch attendees: ${attendeesData.error}`);
          }
        } catch (attendeeError) {
          console.error('❌ Error fetching attendees:', attendeeError);
          setError('Failed to fetch event attendees');
        }
        
        setCurrentStep(CommunityStep.MANUAL_FORM);
      } else {
        setError('No events found in your Eventbrite account');
      }
    } catch (error: any) {
      console.error('❌ Eventbrite connection error:', error);
      setError(error.message || 'Failed to connect to Eventbrite');
    } finally {
      setFetchingEvents(false);
    }
  };

  const renderCsvUpload = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-white mb-4">Upload CSV File</h3>
        <p className="text-gray-300 mb-8">Upload your member data to create your community</p>
      </div>
      
      <div
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
          dragActive 
            ? 'border-[#E0407B] bg-pink-500/10' 
            : 'border-gray-600 hover:border-gray-500'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {csvFile ? (
          <div className="space-y-4">
            <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium text-lg">{csvFile.name}</p>
              <p className="text-gray-400">{(csvFile.size / 1024).toFixed(1)} KB</p>
            </div>
            <CustomButton
              type="button"
              variant="outline"
              onClick={() => setCsvFile(null)}
            >
              Remove File
            </CustomButton>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="w-20 h-20 mx-auto bg-gray-700 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium text-xl mb-2">Drop your CSV file here</p>
              <p className="text-gray-400 mb-6">or click to browse</p>
              <CustomButton
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                Browse Files
              </CustomButton>
            </div>
          </div>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {error && (
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
          <div className="text-red-400 text-sm text-center">{error}</div>
        </div>
      )}
      
      <div className="flex justify-between pt-6">
        <CustomButton
          type="button"
          variant="outline"
          onClick={() => setCurrentStep(CommunityStep.METHOD_SELECTION)}
        >
          Back
        </CustomButton>
        <CustomButton
          type="button"
          variant="form"
          onClick={() => setCurrentStep(CommunityStep.MANUAL_FORM)}
          disabled={!csvFile}
        >
          Continue
        </CustomButton>
      </div>
    </div>
  );

  const renderEventbriteToken = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-white mb-4">Connect Eventbrite</h3>
        <p className="text-gray-300 mb-8">Enter your Eventbrite private token to import your events</p>
      </div>
      
      {/* Eventbrite Onboarding Guide */}
      <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
        <div className="aspect-video bg-gray-700 rounded-lg overflow-hidden mb-4">
          <img 
            src="/event-brite-onboard.png" 
            alt="How to get your Eventbrite private token" 
            className="w-full h-full object-contain"
          />
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-lg font-medium mb-2">How to get your Eventbrite private token</p>
          <p className="text-gray-500 text-sm">Follow the steps above to generate your private token from Eventbrite</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <label className="block text-gray-300 text-sm font-bold mb-2">
          Eventbrite Private Token *
        </label>
        <input
          type="password"
          value={eventbriteToken}
          onChange={(e) => setEventbriteToken(e.target.value)}
          placeholder="Enter your Eventbrite private token"
          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E0407B] focus:border-[#E0407B] transition-colors"
        />
      </div>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
          <div className="text-red-400 text-sm text-center">{error}</div>
        </div>
      )}
      
      <div className="flex justify-between pt-6">
        <CustomButton
          type="button"
          variant="outline"
          onClick={() => setCurrentStep(CommunityStep.METHOD_SELECTION)}
        >
          Back
        </CustomButton>
        <CustomButton
          type="button"
          variant="form"
          onClick={handleEventbriteTokenSubmit}
          disabled={!eventbriteToken.trim() || fetchingEvents}
        >
          {fetchingEvents ? 'Connecting to Eventbrite...' : 'Connect & Import Events'}
        </CustomButton>
      </div>
    </div>
  );

  const renderCommunityForm = () => (
    <CommunityForm
      initialData={communityData}
      onDataChange={setCommunityData}
      onSubmit={handleCommunitySubmit}
      onBack={() => {
        if (selectedMethod === CommunityCreationMethod.EVENTBRITE_IMPORT) {
          setCurrentStep(CommunityStep.EVENTBRITE_TOKEN);
        } else {
          setCurrentStep(CommunityStep.METHOD_SELECTION);
        }
      }}
      loading={loading}
      error={error}
    />
  );

  return (
    <Dialog 
      title={getDialogTitle()} 
      onClose={onClose} 
      dismissible={false}
    >
      <div className="min-w-[900px] max-w-5xl">
        {currentStep === CommunityStep.METHOD_SELECTION && renderMethodSelection()}
        
        {currentStep === CommunityStep.CSV_UPLOAD && renderCsvUpload()}
        {currentStep === CommunityStep.EVENTBRITE_TOKEN && renderEventbriteToken()}
        {currentStep === CommunityStep.MANUAL_FORM && renderCommunityForm()}
      </div>
    </Dialog>
  );
};

export default CommunityOnboardingDialog;
