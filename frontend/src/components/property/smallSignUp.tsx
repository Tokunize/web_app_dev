import React from 'react';
import { LoginButton } from '../buttons/loginButton';

const slideAnimation = {
  animation: 'slideSideToSide 2s ease-in-out infinite',
};

const keyframes = `
@keyframes slideSideToSide {
  0% {
    transform: translateX(-5px);
  }
  50% {
    transform: translateX(5px);
  }
  100% {
    transform: translateX(-5px);
  }
}
`;

export const SmallSignUpForm: React.FC = () => {
  return (
    <>
      <style>
        {keyframes}
      </style>
      <div style={slideAnimation} className="bg-white shadow-lg rounded-lg p-6 max-w-sm mx-auto mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Want to Learn More?
        </h2>
        <p className="text-gray-600 mb-6">
          If you are interested in getting more information or accessing exclusive features, we invite you to sign up. Feel free to log in to explore more!
        </p>
        <LoginButton />
      </div>
    </>
  );
};
