import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { PropertyAccordion } from "@/public/marketplace/propertyAccordion";
import { BackButton } from "@/components/buttons/backButton";
import { LoadingSpinner } from "@/components/loadingSpinner";
import shareIcon from "../../assets/share.png"
import { PropertyImagesGallery } from "@/components/PropertyImagesGallery";
import { useGetAxiosRequest } from "@/hooks/getAxiosRequest";
import { Property } from '@/types';
import PurchaseForm from '@/components/forms/buyPropertyForm';


export const SingleProperty = () => {
  const { reference_number } = useParams();
  const { data, loading, error } = useGetAxiosRequest<Property>(`${import.meta.env.VITE_APP_BACKEND_URL}property/single/${reference_number}/?view=overview`);
  
  if (!reference_number) {
    return <div>Property not found</div>;
  }
  if (loading) {
    return <LoadingSpinner />;
  }
  if (error) {
    return <div>{error}</div>;
  }

  const images = data?.image || [];

  return (
    <section className="px-[20px] md:px-[60px]">
      <div className="flex justify-between items-center md:py-[20px]">
        <BackButton />
        <Button variant="outline" className="flex items-center space-x-2">
          <span className="text-gray-700">Share</span>
          <img alt="share" className="h-4" src={shareIcon} />
        </Button>
      </div>

      <PropertyImagesGallery images={images} />
  
      <div className="flex space-x-[40px] justify-between mt-8">
        <div className="md:w-2/3">
          {data && <PropertyAccordion overviewData={data} property_id={reference_number}  />}
        </div>
        <div className="md:w-1/3">
          {/* Asegurarse de que los datos estén disponibles antes de renderizar el formulario de compra */}
          {data && (
            <PurchaseForm
              property_id={reference_number}
              tokenPrice={data.tokens[0].token_price} // Convertir a número si es necesario
              projected_annual_return={parseFloat(data.projected_annual_return)} // Convertir a número si es necesario
            />
          )}
        </div>
      </div>
    </section>
  );
};
