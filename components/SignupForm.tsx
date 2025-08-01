import React, { useState } from 'react';
import TabButton from './TabButton';
import CustomInput from './CustomInput';
import CustomCheckbox from './CustomCheckbox';
import Dialog from './Dialog';
import CustomButton from './CustomButton';
import { AuthTab } from '../types';

const SuccessView: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center space-y-4 py-8">
      <svg className="w-16 h-16 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p className="text-xl font-bold">You're on the list!</p>
      <p className="text-gray-300">{message}</p>
    </div>
);

interface WaitlistFormProps {
  onSubmitted: () => void;
}

const SignUpForm: React.FC<WaitlistFormProps> = ({ onSubmitted }) => {
  const [authTab, setAuthTab] = useState<AuthTab>(AuthTab.Email);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    phone: '',
    email: '',
    newsletter: true,
    whatsapp: true,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Omit<typeof formData, 'newsletter' | 'whatsapp'>, string>>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name as keyof typeof errors]) {
        setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  const validate = () => {
    const newErrors: typeof errors = {};
    if (!formData.firstname.trim()) newErrors.firstname = 'First name is required.';
    if (!formData.lastname.trim()) newErrors.lastname = 'Last name is required.';
    
    if (authTab === AuthTab.Phone) {
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required.';
    } else {
      if (!formData.email.trim()) {
          newErrors.email = 'Email is required.';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Email is invalid.';
      }
    }
    
    return newErrors;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
    }
    console.log("Waitlist Form Submitted:", formData);
    setIsSuccess(true);
    setTimeout(() => onSubmitted(), 3000);
  };
  
  if(isSuccess) {
    return <SuccessView message="We'll notify you when we launch." />
  }

  return (
    <Dialog title={`Join Kyozo`} onClose={onSubmitted}>
      <div className="flex justify-center items-center bg-[#2C2C2E] rounded-full p-1 mb-8">
        <TabButton label="Email" isActive={authTab === AuthTab.Email} onClick={() => setAuthTab(AuthTab.Email)} />
        <TabButton label="Phone" isActive={authTab === AuthTab.Phone} onClick={() => setAuthTab(AuthTab.Phone)} />
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CustomInput label="Firstname *" name="firstname" type="text" value={formData.firstname} onChange={handleInputChange} error={errors.firstname}/>
          <CustomInput label="Lastname *" name="lastname" type="text" value={formData.lastname} onChange={handleInputChange} error={errors.lastname}/>
        </div>
        
        {authTab === AuthTab.Email ? (
          <CustomInput label="Email *" name="email" type="email" value={formData.email} onChange={handleInputChange} error={errors.email}/>
        ) : (
          <CustomInput label="Phone *" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} error={errors.phone}/>
        )}
        
        <div className="space-y-4 pt-2">
          <CustomCheckbox id="newsletter" name="newsletter" label="Sign me up to the CreativeLab newsletter" checked={formData.newsletter} onChange={handleInputChange} />
          <CustomCheckbox id="whatsapp" name="whatsapp" label="I agree to be contacted via WhatsApp" checked={formData.whatsapp} onChange={handleInputChange} />
        </div>

        <CustomButton type="submit" variant="form">
          Submit
        </CustomButton>
      </form>
    </Dialog>
  );
};

export default SignUpForm;
