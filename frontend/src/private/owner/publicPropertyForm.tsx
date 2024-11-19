import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { publicProperty } from "./publicPropertySchema";
import { PropertyApplicantInfo } from "@/components/publicProperty/propertyApplicantInfo";
import { formValuesPublicProperty } from "./publicPropertySchema";
import { useState } from "react";
import { ChoosePropertyType } from "@/components/publicProperty/propertyType";
import { RadioGroupForm } from "@/components/forms/radioGroupForm";
import { Button } from "@/components/ui/button";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import OnBehalfInfo from "@/components/publicProperty/onBehalfInfo";
import { PropertyDetails } from "@/components/publicProperty/propertyDetails";

export const PublicPropertyForm = () => {
    const [step, setStep] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate()

    const { control, handleSubmit, formState: { errors }, reset, watch } = useForm<formValuesPublicProperty>({
        resolver: zodResolver(publicProperty),
    });

    // Usamos watch para ver el valor de onBehalf
    const onBehalf = watch("onBehalf"); // Obtenemos el valor actual de "onBehalf"

    const onSubmit: SubmitHandler<formValuesPublicProperty> = (data) => {
        console.log(data);
        reset();
    };

    const handleNext = () => {
        // Verifica el valor de "onBehalf" antes de avanzar
        if (step === 3) {
            if (onBehalf === "true") {
                setStep(4); // Si es "Yes", avanza al paso 4
            } else {
                setStep(5); // Si es "No", salta al siguiente paso (puedes ajustar según sea necesario)
            }
        } else if (step < 9) {
            setStep(step + 1); // Avanza al siguiente paso si no es el paso 3
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1); // Retrocede al paso anterior
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return <PropertyApplicantInfo control={control} errors={errors} />;
            case 2:
                return <ChoosePropertyType control={control} errors={errors} />;
            case 3: 
                return (
                    <RadioGroupForm
                        name="onBehalf"
                        control={control}
                        label="Are you submitting a property onto the platform for yourself?"
                        options={[
                            { label: "Yes", value: "true" },
                            { label: "No", value: "false" }
                        ]}
                        error={errors.onBehalf?.message}
                    />
                );
            case 4:
                return <OnBehalfInfo control={control} errors={errors}/>;
            case 5:
                return (
                    <RadioGroupForm
                        name="preferredContactMethod"
                        control={control}
                        label="Preferred Communication Method"
                        options={[
                            { label: "Phone", value: "phone" },
                            { label: "Email", value: "email" }
                        ]}
                        error={errors.preferredContactMethod?.message}
                    />
                )
            case 6:
                return <PropertyDetails control={control} errors={errors}/>
            default:
                return null;
        }
    };

    const handleExit = () => {
        setIsModalOpen(true);
      };
    
    const confirmExit = () => {
        // Navegar a la pantalla anterior
        navigate(-1);
      };
    const cancelExit = () => {
        setIsModalOpen(false);
      };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col min-h-screen space-y-4 relative">
        <header className="flex justify-between px-[20px] md:px-[80px] mt-[40px]">
            <img alt="tokunize-logo" className="w-32" src={logo} />
            <Button variant="outline" onClick={handleExit}>Exit</Button>
        </header>
    
        {/* Renderiza el contenido dependiendo del paso actual */}
        <main className="flex-grow  px-[20px] md:px-[80px] md:w-[70%] mx-auto md:mt-[0px]">
            {renderStep()}
        </main>
    
        {/* Footer pegado a la parte inferior */}
        <footer className="flex flex-col mt-auto relative justify-between bottom-0 p-4">
            <Progress className="rounded-xs h-2 bg-gray-200 mb-5" value={(step / 8) * 100} />
            <div className="flex justify-between">
                {step > 1 && (
                    <Button type="button" onClick={handleBack}>Back</Button>
                )}
                {step < 10 && (
                    <Button type="button" onClick={handleNext}>Next</Button>
                )}
                {step === 10 && (
                    <Button type="submit">Submit</Button>
                )}
            </div>
        </footer>
    
        {/* Modal de confirmación */}
        {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-80">
                    <h2 className="text-lg font-semibold">Confirm Exit</h2>
                    <p className="mt-2">Are you sure you want to exit? You will lose your progress.</p>
                    <div className="flex justify-end mt-4">
                        <Button variant="outline" onClick={cancelExit} className="mr-2">Cancel</Button>
                        <Button onClick={confirmExit} className="bg-red-500 text-white">Exit</Button>
                    </div>
                </div>
            </div>
        )}
    </form>
    
    );
};


// AB123456C