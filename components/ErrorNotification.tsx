import React from 'react';

interface ErrorNotificationProps {
  message: string;
  onClose?: () => void;
}

const ErrorNotification: React.FC<ErrorNotificationProps> = ({ message, onClose }) => {
  if (!message) return null;
  
  return (
    <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-6 relative">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-red-400">{message}</p>
        </div>
        {onClose && (
          <button 
            type="button" 
            className="ml-auto -mx-1.5 -my-1.5 bg-transparent text-red-400 hover:text-red-500 rounded-lg p-1.5"
            onClick={onClose}
          >
            <span className="sr-only">Dismiss</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorNotification;
