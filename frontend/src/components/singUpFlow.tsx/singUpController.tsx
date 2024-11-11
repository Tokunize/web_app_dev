import React, { useState } from 'react';
import "../../styles/singUp.css"; // Asegúrate de que esta ruta sea correcta
import { LoginButton } from '../buttons/loginButton';
import logo from "../../assets/header.png";
import { Input } from "@/components/ui/input"; 
import { Button } from "@/components/ui/button"; 
import { SignUpForm } from '../forms/singUpForm';
import { AccountType } from '@/views/accounType';
import { LoadingSpinner } from '../loadingSpinner';

// Componente EmailInput
const EmailInput: React.FC<{ onEmailSubmit: (email: string) => void }> = ({ onEmailSubmit }) => {
  const [email, setEmail] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);
  const [emailError, setEmailError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);

    // Validar el email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailPattern.test(inputEmail)) {
      setEmailError('');
      setIsDisabled(false);
    } else {
      setEmailError('Please enter a valid email address');
      setIsDisabled(true);
    }
  };

  const handleContinue = () => {
    if (!isDisabled) {
      onEmailSubmit(email);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="rounded-lg max-w-md p-5 h-auto bg-white shadow-lg flex flex-col"> 
        <img alt='logo' src={logo} className="h-16 mx-auto mb-5" />
        <h2 className="text-2xl font-bold mb-2 text-center">Create An Account</h2>
        <p className="text-gray-500 mb-[45px] text-sm text-center">Invest in Commercial Real Estate. Secure. Simple. Swift.</p>
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

        <span className="text-xs text-gray-500 mt-3">By signing up, you acknowledge that you have read and understood, and agree to Tokunize’s <span className="text-[#C8E870]">Terms</span> and <span className="text-[#C8E870]">Privacy Policy</span></span>
      </div>
      <span className="mt-5">Already have an account? <LoginButton type="singUp"/> </span>
    </div>
  );
};

// Componente principal SignUpPage con Wizard Steps
const SignUpPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1); // Estado para controlar el paso actual
  const [email, setEmail] = useState('');
  const [formData, setFormData] = useState(null); // Para almacenar datos del formulario de registro
  const [loading, setLoading] = useState(false); // Estado para el spinner

  // Manejador para avanzar de paso
  const handleEmailSubmit = (email: string) => {
    setEmail(email);
    setCurrentStep(2); // Avanzar al siguiente paso (SignUpForm)
  };

  // Manejador para avanzar de paso desde SignUpForm
  const handleFormSubmit = (formValues: any) => {
    setFormData(formValues); // Guardar los datos del formulario
    setLoading(true); // Mostrar el spinner

    // Simulamos un retraso de 3 segundos
    setTimeout(() => {
      setCurrentStep(3); // Avanzar al paso final (AccountType)
      setLoading(false); // Ocultar el spinner
    }, 3000);
  };

  return (
    <section className="flex justify-center items-center" id="signUpSection">
      {/* Paso 1: EmailInput */}
      {currentStep === 1 && (
        <EmailInput onEmailSubmit={handleEmailSubmit} />
      )}
      
      {/* Paso 2: SignUpForm */}
      {currentStep === 2 && !loading && ( // Solo renderizar el formulario si no estamos cargando
        <SignUpForm email={email} setIsEmailSubmitted={setCurrentStep} onSignUpSuccess={handleFormSubmit} />
      )}
      
      {/* Spinner para la transición entre pasos */}
      {currentStep === 2 && loading && ( // Si estamos cargando, muestra el spinner
        <LoadingSpinner/>
      )}

      {/* Paso 3: AccountType */}
      {currentStep === 3 && (
        <AccountType formData={formData} />
      )}
    </section>
  );
};

export default SignUpPage;
