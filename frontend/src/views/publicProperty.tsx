import React, { useState } from "react";
import { ChoosePropertyType } from "@/components/publicProperty/propertyType";
import { ChoosePropertyLocation } from "@/components/publicProperty/propertyLocation";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import logo from "../assets/img/logo.jpg";
import { PropertyDetails } from "@/components/publicProperty/propertyDetails";
import { PropertyAmenities } from "@/components/publicProperty/propertyAmenities";
import { PropertyImages } from "@/components/publicProperty/propertyImages";
import { PropertyValue } from "@/components/publicProperty/propertyPorcentage";
import { PropertySummary } from "@/components/publicProperty/propertySummary";
import { PropertyDescription } from "@/components/publicProperty/propertyDescription";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ClipLoader from 'react-spinners/ClipLoader';
import { useAuth0 } from "@auth0/auth0-react";
import { createNotification } from "@/components/notificationService";

interface PropertyLocation {
  postcode: string;
  country: string;
  adminDistrict: string;
}

export const PublicPropertyPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getAccessTokenSilently } = useAuth0();
  
  // Estado para manejar el progreso del paso
  const [step, setStep] = useState(1);
  // Estado para manejar los datos de la propiedad
  const [propertyType, setPropertyType] = useState("");
  const [propertyLocation, setPropertyLocation] = useState<PropertyLocation | null>(null);
  const [propertyDetails, setPropertyDetails] = useState({
    bedroomCount: 0,
    bathroomCount: 0,
    size: "",
    title: "", // Add initial state for title
    yearBuilt: "" // Add initial state for year built
  });
  const [amenities, setAmenities] = useState<string[]>([
    "Pool",
    "Gym",
    "Parking",
    "Wi-Fi",
    "Garden",
  ]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [marketValue, setMarketValue] = useState<string>('789405');
  const [ownershipPercentage, setOwnershipPercentage] = useState<string>('50');
  
  // Estado para manejar la carga
  const [loading, setLoading] = useState(false);

  const goNext = () => setStep((prev) => Math.min(prev + 1, 8));
  const goBack = () => setStep((prev) => Math.max(prev - 1, 1));

  // Función para determinar si el botón Next debe estar habilitado
  const isNextDisabled = () => {
    switch (step) {
      case 1:
        return propertyType === "";
      case 2:
        return propertyLocation === null;
      case 3:
        return propertyDetails.bedroomCount <= 0 || propertyDetails.bathroomCount <= 0 || propertyDetails.size === "";
      case 4:
        return selectedAmenities.length === 0; // Si no hay amenidades seleccionadas
      case 5:
        return images.length === 0; // Si no hay imágenes subidas
      case 6:
        return description.trim() === ""; // Si la descripción está vacía
      case 7:
        return marketValue === "" || ownershipPercentage === ""; // Validar valores de mercado y porcentaje de propiedad
      default:
        return false;
    }
  };

  const onSubmit = async () => {
    try {
      setLoading(true); // Activar el loader
      const accessToken = await getAccessTokenSilently();  

      if (!accessToken) {
        console.error("Access token not found");
        return;
      }
  
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      };
  
      const finalData = {
        title: propertyDetails.title,
        bedrooms: propertyDetails.bedroomCount,
        bathrooms: propertyDetails.bathroomCount,
        price: marketValue,
        country: propertyLocation?.country,
        property_type: propertyType,
        location: propertyLocation?.adminDistrict,
        propertyDetails,
        amenities: selectedAmenities, 
        description,
        size: propertyDetails.size,
        // ownershipPercentage,
        status: "under_review",
        year_built: propertyDetails.yearBuilt,
        image: images
      };
  
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}property/create/`,
        finalData,
        config
      );
      console.log(response.data);
        
      toast({
        title: "Property submitted!",
        description: "Your property has been successfully submitted.",
        variant: "default",
      });

      // Crear notificación después de enviar la propiedad
      await createNotification(
        { message: `New property "${propertyDetails.title}" has been created! We are going to review and we will notify when it is ready to publish. Thank you !` }, // Mensaje de la notificación
        accessToken // Usar el access token para autenticación
      );

      navigate("/portfolio/");
  
      // Restablecer manualmente los estados a sus valores iniciales
      setPropertyType("");
      setPropertyLocation(null);
      setPropertyDetails({
        bedroomCount: 0,
        bathroomCount: 0,
        size: "",
        title: "", // Reset title
        yearBuilt: "" // Reset year built
      });
      setSelectedAmenities([]);
      setImages([]);
      setDescription("");
      setMarketValue(''); // o un valor por defecto
      setOwnershipPercentage(''); // o un valor por defecto
      setStep(1); // Regresar al primer paso o a donde desees
  
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "There was an error submitting your property.",
        variant: "destructive",
      });
  
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setLoading(false); // Desactivar el loader al finalizar
    }
  };
  
  const renderStep = () => {
    switch (step) {
      case 1:
        return <ChoosePropertyType propertyType={propertyType} setPropertyType={setPropertyType} />;
      case 2:
        return <ChoosePropertyLocation propertyLocation={propertyLocation} setPropertyLocation={setPropertyLocation} />;
      case 3:
        return (
          <PropertyDetails
            propertyDetails={propertyDetails}
            setPropertyDetails={setPropertyDetails}
          />
        );
      case 4:
        return (
          <PropertyAmenities
            amenities={amenities}
            setAmenities={setAmenities}
            selectedAmenities={selectedAmenities}
            setSelectedAmenities={setSelectedAmenities}
          />
        );
      case 5:
        return <PropertyImages images={images} setImages={setImages} />;
      case 6:
        return <PropertyDescription description={description} setDescription={setDescription} />;
      case 7:
        return (
          <PropertyValue
            marketValue={marketValue}
            setMarketValue={setMarketValue}
            ownershipPercentage={ownershipPercentage}
            setOwnershipPercentage={setOwnershipPercentage}
          />
        );
      case 8:
        return (
          <PropertySummary
            propertyLocation={propertyLocation} 
            propertyType={propertyType}
            propertyDetails={propertyDetails}
            firstImage={images[0]}
          />
        );
      default:
        return null;
    }
  };

  return (
    <section className="flex flex-col h-screen space-y-5">
      <header className="flex justify-between px-[20px] md:px-[80px] mt-[40px]">
        <img alt="tokunize-logo" className="w-32" src={logo} />
        <Button variant="outline" onClick={onSubmit}>Save & Exit</Button>
      </header>

      <main className="flex-grow h-[400px] px-[20px] md:px-[80px] md:w-[70%] mx-auto md:mt-[0px]">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <ClipLoader size={50} color="#4A90E2" />
          </div>
        ) : (
          renderStep()
        )}
      </main>

      <footer className="pb-[30px]">
        <Progress className="rounded-xs h-2 bg-gray-200 mb-5" value={(step / 8) * 100} />
        <div className="flex justify-between px-5">
          {step > 1 && (
            <Button variant="outline" onClick={goBack}>
              Back
            </Button>
          )}
          {step < 8 && (
            <Button
              className="w-auto px-[50px] bg-black text-white hover:bg-[none]"
              onClick={goNext}
              disabled={isNextDisabled()} // Deshabilitar el botón si no hay selección
            >
              {step === 8 ? "Publish" : "Next"}
            </Button>
          )}
          {step === 8 && (
            <Button
              onClick={onSubmit}
            >
              Submit Property
            </Button>
          )}
        </div>
      </footer>
    </section>
  );
};
