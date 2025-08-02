"use client";

import React, { useState, useEffect } from 'react';
import { colors, borderRadius, fontWeights, fontSizes } from '../../../../styles/theme';
import CustomButton from '../../../CustomButton';
import SimpleInput from '../../communities/ui/SimpleInput';
import SimpleTextarea from '../../communities/ui/SimpleTextarea';
import SimpleSelect from '../../communities/ui/SimpleSelect';

interface MessagingTabProps {
  communityId: string;
}

interface Member {
  id: string;
  name: string;
  phone?: string;
  email: string;
}

interface Template {
  id: string;
  name: string;
  content: string;
  variables: string[];
  category: string;
}

const MessagingTab: React.FC<MessagingTabProps> = ({ communityId }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [messageContent, setMessageContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: 'template-1',
      name: 'Event Reminder',
      content: 'Hi {{1}}, this is a reminder about our upcoming event on {{2}}. We look forward to seeing you!',
      variables: ['name', 'date'],
      category: 'event'
    },
    {
      id: 'template-2',
      name: 'Welcome Message',
      content: 'Welcome to {{1}}, {{2}}! We\'re excited to have you join our community.',
      variables: ['community_name', 'name'],
      category: 'onboarding'
    },
    {
      id: 'template-3',
      name: 'Payment Confirmation',
      content: 'Thank you for your payment of {{1}} for {{2}}. Your transaction is complete.',
      variables: ['amount', 'item'],
      category: 'payment'
    }
  ]);

  // Fetch members
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        // In a real implementation, this would fetch from Firebase
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data
        setMembers([
          {
            id: '1',
            name: 'Jane Cooper',
            email: 'jane.cooper@example.com',
            phone: '+1234567890'
          },
          {
            id: '2',
            name: 'Alex Smith',
            email: 'alex.smith@example.com',
            phone: '+1987654321'
          },
          {
            id: '3',
            name: 'Michael Johnson',
            email: 'michael.johnson@example.com',
            phone: '+1122334455'
          }
        ]);
      } catch (error) {
        console.error('Error fetching members:', error);
        setError('Failed to load members. Please try again.');
      }
    };

    fetchMembers();
  }, [communityId]);

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setMessageContent(template.content);
    }
  };

  const handleSelectAllMembers = () => {
    if (selectedMembers.length === members.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(members.map(member => member.id));
    }
  };

  const handleToggleMember = (memberId: string) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };

  const handleSendMessage = async () => {
    if (selectedMembers.length === 0) {
      setError('Please select at least one member to send the message to.');
      return;
    }

    if (!messageContent.trim()) {
      setError('Please enter a message to send.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      // In a real implementation, this would send messages via Sinch API
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccessMessage(`Message sent successfully to ${selectedMembers.length} members.`);
      setSelectedMembers([]);
    } catch (err) {
      setError('Failed to send messages. Please try again.');
      console.error('Error sending messages:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const templateOptions = templates.map(template => ({
    value: template.id,
    label: template.name
  }));

  return (
    <div className={`bg-[${colors.bgCard}] ${borderRadius.xl} border border-[${colors.borderDark}] p-6`}>
      <h2 className={`${fontSizes.xl} ${fontWeights.bold} text-[${colors.textPrimary}] mb-6`}>
        WhatsApp Messaging
      </h2>
      
      {error && (
        <div className={`bg-red-900/20 border border-red-500/50 text-red-100 p-4 ${borderRadius.md} mb-6`}>
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className={`bg-green-900/20 border border-green-500/50 text-green-100 p-4 ${borderRadius.md} mb-6`}>
          {successMessage}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="mb-6">
            <h3 className={`${fontSizes.lg} ${fontWeights.semibold} text-[${colors.textPrimary}] mb-4`}>
              1. Select Recipients
            </h3>
            
            <div className={`bg-[${colors.bgDarker}] ${borderRadius.md} border border-[${colors.borderDark}] p-4 mb-4`}>
              <div className="flex justify-between items-center mb-4">
                <span className={`text-[${colors.textPrimary}] ${fontWeights.medium}`}>
                  Members ({members.length})
                </span>
                <CustomButton
                  variant="text"
                  className={`text-[${colors.primary}] text-sm`}
                  onClick={handleSelectAllMembers}
                >
                  {selectedMembers.length === members.length ? 'Deselect All' : 'Select All'}
                </CustomButton>
              </div>
              
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {members.map(member => (
                  <div 
                    key={member.id} 
                    className={`flex items-center justify-between p-3 ${borderRadius.md} ${
                      selectedMembers.includes(member.id) 
                        ? `bg-[${colors.primary}]/10 border border-[${colors.primary}]/30` 
                        : `border border-[${colors.borderDark}]`
                    }`}
                    onClick={() => handleToggleMember(member.id)}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedMembers.includes(member.id)}
                        onChange={() => {}}
                        className="mr-3"
                      />
                      <div>
                        <div className={`text-[${colors.textPrimary}]`}>{member.name}</div>
                        <div className={`text-[${colors.textSecondary}] text-sm`}>{member.phone || 'No phone number'}</div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {members.length === 0 && (
                  <div className={`text-center py-4 text-[${colors.textSecondary}]`}>
                    No members found with phone numbers.
                  </div>
                )}
              </div>
              
              <div className={`mt-4 text-sm text-[${colors.textSecondary}]`}>
                Selected: {selectedMembers.length} of {members.length} members
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="mb-6">
            <h3 className={`${fontSizes.lg} ${fontWeights.semibold} text-[${colors.textPrimary}] mb-4`}>
              2. Compose Message
            </h3>
            
            <div className="mb-4">
              <label className={`block mb-2 text-[${colors.textPrimary}] ${fontWeights.medium}`}>
                Select Template
              </label>
              <SimpleSelect
                options={templateOptions}
                value={selectedTemplate}
                onChange={(value) => handleSelectTemplate(value)}
              />
              <p className={`mt-1 text-xs text-[${colors.textSecondary}]`}>
                Only pre-approved templates from Meta can be used for WhatsApp Business messages
              </p>
            </div>
            
            <div className="mb-4">
              <label className={`block mb-2 text-[${colors.textPrimary}] ${fontWeights.medium}`}>
                Message Content
              </label>
              <SimpleTextarea
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Message content will appear here when you select a template"
                rows={6}
                disabled={!selectedTemplate}
              />
              <p className={`mt-1 text-xs text-[${colors.textSecondary}]`}>
                Variables like {'{{'}{'{1}'}{'}}'} will be replaced with actual values when sending
              </p>
            </div>
            
            {selectedTemplate && (
              <div className={`bg-[${colors.bgDarker}] ${borderRadius.md} border border-[${colors.borderDark}] p-4 mb-4`}>
                <h4 className={`text-[${colors.textPrimary}] ${fontWeights.medium} mb-2`}>
                  Template Variables
                </h4>
                
                {templates.find(t => t.id === selectedTemplate)?.variables.map((variable, index) => (
                  <div key={index} className="mb-3">
                    <label className={`block mb-1 text-sm text-[${colors.textSecondary}]`}>
                      {variable} ({`{${index + 1}}`})
                    </label>
                    <SimpleInput
                      type="text"
                      placeholder={`Enter ${variable}`}
                      value=""
                      onChange={() => {}}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end mt-6">
        <CustomButton
          variant="primary"
          className={`${borderRadius.full} px-6`}
          onClick={handleSendMessage}
          disabled={isLoading || selectedMembers.length === 0 || !messageContent.trim()}
        >
          {isLoading ? 'Sending...' : 'Send WhatsApp Messages'}
        </CustomButton>
      </div>
    </div>
  );
};

export default MessagingTab;
