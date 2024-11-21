import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { PropertyAccordion } from "@/components/propertyAccordion";
import { PurchaseForm } from "@/components/forms/buyPropertyForm";
import { BackButton } from "@/components/buttons/backButton";
import { LoadingSpinner } from "@/components/loadingSpinner";
import shareIcon from "../assets/Share.png";
import { PropertyImagesGallery } from "@/components/PropertyImagesGallery";
import { useGetAxiosRequest } from "@/hooks/getAxiosRequest";
import { Property } from '@/types';



export const SingleProperty = () => {
  const { id } = useParams<{ id: string }>();
  const numericId = id ? parseInt(id, 10) : undefined; // Convertir el ID a número, o undefined si es incorrecto
  const { data, loading, error } = useGetAxiosRequest<Property>(`${import.meta.env.VITE_APP_BACKEND_URL}property/${id}/landing-page/?view=overview`);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Asegurarse de que el ID sea válido
  if (numericId === undefined || isNaN(numericId)) {
    return <div>Invalid property ID</div>;
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

      {/* Mostrar la galería de imágenes solo si hay imágenes disponibles */}
      {images.length > 0 ? (
        <PropertyImagesGallery images={images} />
      ) : (
        <div>No images available</div> // Puedes personalizar este mensaje con un ícono o texto
      )}

      <div className="flex space-x-[40px] justify-between mt-8">
        <div className="md:w-2/3">
          {numericId && data && <PropertyAccordion overviewData={data} property_id={numericId}  />}
        </div>
        <div className="md:w-1/3">
          {/* Asegurarse de que los datos estén disponibles antes de renderizar el formulario de compra */}
          {data && (
            <PurchaseForm
              property_id={numericId}
              tokenPrice={parseFloat(data.tokens[0].token_price) } // Convertir a número si es necesario
              projected_annual_return={parseFloat(data.projected_annual_return)} // Convertir a número si es necesario
            />
          )}
        </div>
      </div>
    </section>
  );
};
