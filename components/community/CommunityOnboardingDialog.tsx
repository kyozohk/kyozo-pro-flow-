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
import { colors, fonts } from '../../styles/theme';
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
  PREVIEW_DATA = 'preview_data',
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
    <div className="w-full h-full flex flex-col md:flex-row items-start gap-8 md:gap-12 p-8 md:p-12">
      {/* Left Side - Text Content (Card1 Style) */}
      <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
        <p
          className="text-sm font-bold tracking-[0.2em] uppercase"
          style={{ color: colors.card.tagText, fontFamily: fonts.card }}
        >
          COMMUNITY SETUP
        </p>
        <h2
          className="text-3xl md:text-5xl font-bold leading-tight tracking-tighter"
          style={{ color: colors.card.headingText, fontFamily: fonts.card, letterSpacing: '-0.03em' }}
        >
          Create Your First Community
        </h2>
        <p 
          className="text-base md:text-lg leading-relaxed"
          style={{ color: colors.card.bodyText, fontFamily: fonts.card }}
        >
          Choose how you'd like to set up your community and import your members. You can upload a CSV file, connect your Eventbrite account, or create everything manually.
        </p>
      </div>
      
      {/* Right Side - Method Cards */}
      <div className="w-full md:w-1/2 grid grid-cols-1 gap-4">
        {/* CSV Import */}
        <div 
          onClick={() => handleMethodSelect(CommunityCreationMethod.CSV_IMPORT)}
          className="group cursor-pointer transition-all duration-300 hover:scale-105"
        >
          <div 
            className="p-4 rounded-xl border transition-all duration-300 group-hover:border-opacity-100"
            style={{ 
              backgroundColor: colors.card.background, 
              borderColor: colors.card.border,
              borderWidth: '1px'
            }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 
                  className="text-lg font-bold mb-1"
                  style={{ color: colors.card.headingText, fontFamily: fonts.card }}
                >
                  Import from CSV
                </h4>
                <p 
                  className="text-sm leading-relaxed"
                  style={{ color: colors.card.bodyText, fontFamily: fonts.card }}
                >
                  Upload a CSV file with your member data to quickly populate
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Eventbrite Import */}
        <div 
          onClick={() => handleMethodSelect(CommunityCreationMethod.EVENTBRITE_IMPORT)}
          className="group cursor-pointer transition-all duration-300 hover:scale-105"
        >
          <div 
            className="p-4 rounded-xl border transition-all duration-300 group-hover:border-opacity-100"
            style={{ 
              backgroundColor: '#ffffff', 
              borderColor: '#e5e5e5',
              borderWidth: '1px'
            }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center flex-shrink-0 p-2">
                <img 
                  src="/eventbritelogo.png" 
                  alt="Eventbrite" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1">
                <h4 
                  className="text-lg font-bold mb-1"
                  style={{ color: '#1a1a1a', fontFamily: fonts.card }}
                >
                  Import from Eventbrite
                </h4>
                <p 
                  className="text-sm leading-relaxed"
                  style={{ color: '#666666', fontFamily: fonts.card }}
                >
                  Connect your Eventbrite account and import attendees
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Manual Creation */}
        <div 
          onClick={() => handleMethodSelect(CommunityCreationMethod.MANUAL_CREATION)}
          className="group cursor-pointer transition-all duration-300 hover:scale-105"
        >
          <div 
            className="p-4 rounded-xl border transition-all duration-300 group-hover:border-opacity-100"
            style={{ 
              backgroundColor: colors.card.background, 
              borderColor: colors.card.border,
              borderWidth: '1px'
            }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 
                  className="text-lg font-bold mb-1"
                  style={{ color: colors.card.headingText, fontFamily: fonts.card }}
                >
                  Create Manually
                </h4>
                <p 
                  className="text-sm leading-relaxed"
                  style={{ color: colors.card.bodyText, fontFamily: fonts.card }}
                >
                  Set up your community from scratch and add members later
                </p>
              </div>
            </div>
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
      case CommunityStep.PREVIEW_DATA:
        return 'Preview Data';
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
        
        setCurrentStep(CommunityStep.PREVIEW_DATA);
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

  const renderPreviewData = () => {
    const dataSource = selectedMethod === CommunityCreationMethod.EVENTBRITE_IMPORT ? 'Eventbrite' : 'CSV';
    const memberCount = csvMembers.length;
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-white mb-4">Preview Imported Data</h3>
          <p className="text-gray-300 mb-2">Review the {memberCount} members imported from {dataSource}</p>
          <p className="text-gray-400 text-sm">Make sure the data looks correct before proceeding</p>
        </div>
        
        {/* Data Summary */}
        <div className="bg-gray-800/50 rounded-xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">{memberCount}</div>
              <div className="text-gray-400 text-sm">Total Members</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">{csvMembers.filter(m => m.email).length}</div>
              <div className="text-gray-400 text-sm">With Email</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">{csvMembers.filter(m => m.phone).length}</div>
              <div className="text-gray-400 text-sm">With Phone</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">{csvMembers.filter(m => m.name || (m.firstName && m.lastName)).length}</div>
              <div className="text-gray-400 text-sm">With Name</div>
            </div>
          </div>
        </div>
        
        {/* Data Table */}
        <div className="bg-gray-800/50 rounded-xl overflow-hidden">
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gray-700/50 sticky top-0">
                <tr>
                  <th className="text-left p-4 text-gray-300 font-medium">#</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Name</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Email</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Phone</th>
                </tr>
              </thead>
              <tbody>
                {csvMembers.slice(0, 50).map((member, index) => {
                  const displayName = member.name || `${member.firstName || ''} ${member.lastName || ''}`.trim() || 'N/A';
                  return (
                    <tr key={index} className="border-t border-gray-700/50 hover:bg-gray-700/30">
                      <td className="p-4 text-gray-400">{index + 1}</td>
                      <td className="p-4 text-white">{displayName}</td>
                      <td className="p-4 text-gray-300">{member.email || 'N/A'}</td>
                      <td className="p-4 text-gray-300">{member.phone || 'N/A'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {memberCount > 50 && (
              <div className="p-4 text-center text-gray-400 bg-gray-700/30">
                Showing first 50 of {memberCount} members
              </div>
            )}
          </div>
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <CustomButton
            type="button"
            variant="outline"
            onClick={() => {
              if (selectedMethod === CommunityCreationMethod.EVENTBRITE_IMPORT) {
                setCurrentStep(CommunityStep.EVENTBRITE_TOKEN);
              } else {
                setCurrentStep(CommunityStep.CSV_UPLOAD);
              }
            }}
          >
            Back to Import
          </CustomButton>
          <CustomButton
            type="button"
            variant="form"
            onClick={() => setCurrentStep(CommunityStep.MANUAL_FORM)}
          >
            Continue to Community Setup
          </CustomButton>
        </div>
      </div>
    );
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
      <div className="w-full h-full" style={{ margin: '80px' }}>
        {currentStep === CommunityStep.METHOD_SELECTION && renderMethodSelection()}
        
        {currentStep === CommunityStep.CSV_UPLOAD && renderCsvUpload()}
        {currentStep === CommunityStep.EVENTBRITE_TOKEN && renderEventbriteToken()}
        {currentStep === CommunityStep.PREVIEW_DATA && renderPreviewData()}
        {currentStep === CommunityStep.MANUAL_FORM && renderCommunityForm()}
      </div>
    </Dialog>
  );
};

export default CommunityOnboardingDialog;
