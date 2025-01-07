import React, { useState } from 'react';
import logo from "../../assets/header.png";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoginButton } from "../buttons/loginButton";

interface SingUpEmailFormProps {
  onEmailSubmit: (email: string) => void;
}

const SingUpEmailForm = ({ onEmailSubmit }: SingUpEmailFormProps) => {
  const [email, setEmail] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);
  const [emailError, setEmailError] = useState('');
  

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError(''); 
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email validation pattern

    if (!emailPattern.test(email)) {
        setEmailError('Please enter a valid email address');
        setIsDisabled(true); // Disable the button if the email is not valid
      } else {
        setEmailError('');
        setIsDisabled(false); // Enable the button if the email is valid
      }
  };


  const handleContinue = () => {
    onEmailSubmit(email)
  };

  return (
    <div className="flex flex-col items-center">
      <div className="rounded-lg max-w-md p-5 h-auto bg-white shadow-lg flex flex-col">
        <img alt="logo" src={logo} className="h-16 mx-auto mb-5" />
        <h2 className="text-2xl font-bold mb-2 text-center">Create An Account</h2>
        <p className="text-gray-500 mb-[45px] text-sm text-center">
          Invest in Commercial Real Estate. Secure. Simple. Swift.
        </p>

        <label htmlFor="email" className="mb-2">Email</label>
        <Input
          type="email"
          id="email"
          placeholder="Enter a valid email address"
          value={email}
          onChange={handleInputChange} 
          className={`mb-4 ${emailError ? 'border-red-500' : 'border-gray-300'}`}
        />
        {emailError && <span className="text-red-500 mb-2">{emailError}</span>}

        <Button
          onClick={handleContinue}
          disabled={isDisabled}
          className={`w-full ${isDisabled ? 'bg-gray-300' : 'text-black'}`}
        >
          Continue
        </Button>

        <span className="text-xs text-gray-500 mt-3">
          By signing up, you acknowledge that you have read and understood, and agree to Tokunize’s <span className="text-[#C8E870]">Terms</span> and <span className="text-[#C8E870]">Privacy Policy</span>
        </span>
      </div>

      <span className="mt-5">
        Already have an account? <LoginButton />
      </span>
    </div>
  );
};

export default SingUpEmailForm;
