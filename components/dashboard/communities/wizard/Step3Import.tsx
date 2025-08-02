"use client";

import React, { useState, useRef } from 'react';
import { colors, borderRadius, fontWeights } from '../../../../styles/theme';
import SimpleInput from '../ui/SimpleInput';
import CustomButton from '../../../CustomButton';
import { CommunityData } from './OnboardingWizard';

interface Step3ImportProps {
  communityData: CommunityData;
  updateCommunityData: (data: Partial<CommunityData>) => void;
  importMethod: 'eventbrite' | 'csv' | 'none';
  setImportMethod: (method: 'eventbrite' | 'csv' | 'none') => void;
  importInProgress: boolean;
  importComplete: boolean;
}

const Step3Import: React.FC<Step3ImportProps> = ({ 
  communityData, 
  updateCommunityData, 
  importMethod,
  setImportMethod,
  importInProgress,
  importComplete
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [csvFileName, setCsvFileName] = useState('');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files[0]);
    }
  };

  const handleFiles = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      alert('Please select a CSV file');
      return;
    }
    
    setCsvFileName(file.name);
    
    // In a real implementation, we would parse the CSV file
    // For this demo, we'll just create mock data
    const mockCsvData = [
      { name: 'Alice Smith', email: 'alice@example.com', phone: '123-456-7890' },
      { name: 'Bob Johnson', email: 'bob@example.com', phone: '234-567-8901' },
      { name: 'Charlie Brown', email: 'charlie@example.com', phone: '345-678-9012' },
      { name: 'Diana Prince', email: 'diana@example.com', phone: '456-789-0123' },
    ];
    
    updateCommunityData({ csvData: mockCsvData });
  };

  return (
    <div className="space-y-6">
      <div>
        <p className={`text-[${colors.textPrimary}] mb-4`}>
          Import members from an existing platform or start from scratch.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            className={`
              p-4 rounded-lg border cursor-pointer transition-colors
              ${importMethod === 'eventbrite' 
                ? `border-[${colors.primary}] bg-[${colors.primary}]/10` 
                : `border-[${colors.borderDark}] hover:border-[${colors.primary}]/50`
              }
            `}
            onClick={() => setImportMethod('eventbrite')}
          >
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center mr-3">
                <span className="text-white font-bold">E</span>
              </div>
              <h3 className={`text-[${colors.textPrimary}] ${fontWeights.medium}`}>Eventbrite</h3>
            </div>
            <p className={`text-sm text-[${colors.textSecondary}]`}>
              Import attendees from your Eventbrite events
            </p>
          </div>
          
          <div 
            className={`
              p-4 rounded-lg border cursor-pointer transition-colors
              ${importMethod === 'csv' 
                ? `border-[${colors.primary}] bg-[${colors.primary}]/10` 
                : `border-[${colors.borderDark}] hover:border-[${colors.primary}]/50`
              }
            `}
            onClick={() => setImportMethod('csv')}
          >
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className={`text-[${colors.textPrimary}] ${fontWeights.medium}`}>CSV Upload</h3>
            </div>
            <p className={`text-sm text-[${colors.textSecondary}]`}>
              Import members from a CSV file
            </p>
          </div>
          
          <div 
            className={`
              p-4 rounded-lg border cursor-pointer transition-colors
              ${importMethod === 'none' 
                ? `border-[${colors.primary}] bg-[${colors.primary}]/10` 
                : `border-[${colors.borderDark}] hover:border-[${colors.primary}]/50`
              }
            `}
            onClick={() => setImportMethod('none')}
          >
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className={`text-[${colors.textPrimary}] ${fontWeights.medium}`}>Start Empty</h3>
            </div>
            <p className={`text-sm text-[${colors.textSecondary}]`}>
              Add members later manually
            </p>
          </div>
        </div>
      </div>
      
      {importMethod === 'eventbrite' && (
        <div className="mt-6 p-4 rounded-lg bg-[${colors.bgDarker}]">
          <h3 className={`text-[${colors.textPrimary}] ${fontWeights.medium} mb-4`}>
            Connect Eventbrite
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className={`block mb-2 text-sm text-[${colors.textPrimary}]`}>
                Eventbrite API Key
              </label>
              <SimpleInput
                type="text"
                value={communityData.eventbriteApiKey || ''}
                onChange={(e) => updateCommunityData({ eventbriteApiKey: e.target.value })}
                placeholder="Enter your Eventbrite API key"
              />
              <p className={`mt-1 text-xs text-[${colors.textSecondary}]`}>
                <a 
                  href="https://www.eventbrite.com/platform/api-keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`text-[${colors.primary}]`}
                >
                  Get your API key from Eventbrite
                </a>
              </p>
            </div>
            
            {importInProgress && (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[${colors.primary}]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className={`text-[${colors.textPrimary}]`}>Importing events and attendees...</span>
              </div>
            )}
            
            {importComplete && (
              <div className={`p-3 bg-green-900/20 border border-green-500/50 text-green-100 rounded-md`}>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Successfully imported 3 events with 12 attendees</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {importMethod === 'csv' && (
        <div className="mt-6 p-4 rounded-lg bg-[${colors.bgDarker}]">
          <h3 className={`text-[${colors.textPrimary}] ${fontWeights.medium} mb-4`}>
            Upload CSV File
          </h3>
          
          <div 
            className={`
              border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
              ${dragActive ? `border-[${colors.primary}] bg-[${colors.primary}]/10` : `border-[${colors.borderDark}]`}
              transition-colors
            `}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            {csvFileName ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-lg bg-green-500/20 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className={`text-[${colors.textPrimary}] mb-1`}>
                  {csvFileName}
                </p>
                <p className={`text-sm text-[${colors.primary}]`}>
                  Click or drag to change file
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-lg bg-[${colors.borderDark}] flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-[${colors.textSecondary}]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className={`text-[${colors.textPrimary}] mb-1`}>
                  Drag and drop your CSV file here
                </p>
                <p className={`text-sm text-[${colors.textSecondary}]`}>
                  or <span className={`text-[${colors.primary}]`}>browse files</span>
                </p>
                <p className={`text-xs text-[${colors.textSecondary}] mt-2`}>
                  CSV should include name, email, and phone (optional)
                </p>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          
          {importInProgress && (
            <div className="mt-4 flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[${colors.primary}]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className={`text-[${colors.textPrimary}]`}>Processing CSV file...</span>
            </div>
          )}
          
          {importComplete && communityData.csvData && (
            <div className="mt-4">
              <div className={`p-3 bg-green-900/20 border border-green-500/50 text-green-100 rounded-md mb-4`}>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Successfully imported {communityData.csvData.length} members</span>
                </div>
              </div>
              
              <div className={`border border-[${colors.borderDark}] rounded-lg overflow-hidden`}>
                <table className="w-full">
                  <thead className={`bg-[${colors.bgDarker}] border-b border-[${colors.borderDark}]`}>
                    <tr>
                      <th className={`px-4 py-2 text-left text-sm text-[${colors.textSecondary}]`}>Name</th>
                      <th className={`px-4 py-2 text-left text-sm text-[${colors.textSecondary}]`}>Email</th>
                      <th className={`px-4 py-2 text-left text-sm text-[${colors.textSecondary}]`}>Phone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {communityData.csvData.slice(0, 3).map((member, index) => (
                      <tr key={index} className={`border-b border-[${colors.borderDark}] last:border-b-0`}>
                        <td className={`px-4 py-2 text-[${colors.textPrimary}]`}>{member.name}</td>
                        <td className={`px-4 py-2 text-[${colors.textPrimary}]`}>{member.email}</td>
                        <td className={`px-4 py-2 text-[${colors.textPrimary}]`}>{member.phone || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {communityData.csvData.length > 3 && (
                  <div className={`px-4 py-2 text-center text-sm text-[${colors.textSecondary}]`}>
                    +{communityData.csvData.length - 3} more members
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      
      {importMethod === 'none' && (
        <div className="mt-6 p-4 rounded-lg bg-[${colors.bgDarker}]">
          <div className="text-center py-4">
            <svg className="w-16 h-16 mx-auto text-[${colors.textSecondary}]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            <h3 className={`text-[${colors.textPrimary}] ${fontWeights.medium} mt-4 mb-2`}>
              Start with an Empty Community
            </h3>
            <p className={`text-[${colors.textSecondary}] max-w-md mx-auto`}>
              You can invite members later from the community dashboard or let them join using invitation links.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step3Import;
