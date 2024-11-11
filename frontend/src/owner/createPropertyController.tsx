import React, { useState } from "react";
import { TokenForm } from "../components/forms/tokenForm";
import { CreatePropertyForm } from "../components/forms/createPropertyForm";
import { useParams } from "react-router-dom";

const CreatePropertyController: React.FC = () => {
    const { propertyId } = useParams<{ propertyId: string }>();
    const numericPropertyId = propertyId ? parseInt(propertyId, 10) : 0;
    const [currentStep, setCurrentStep] = useState(0);

    const handleNext = () => {
        setCurrentStep((prevStep) => prevStep + 1);
    };

    const handleBack = () => {
        setCurrentStep((prevStep) => prevStep - 1);
    };

  return (
    <div >
      {currentStep === 0 && <CreatePropertyForm onNext={handleNext} />}
      {currentStep === 1 && <TokenForm propertyId={numericPropertyId} onNext={handleNext} onBack={handleBack} />}
      {/* {currentStep === 2 && <Summary onBack={handleBack} />} */}
    </div>
  );
};

export default CreatePropertyController;
