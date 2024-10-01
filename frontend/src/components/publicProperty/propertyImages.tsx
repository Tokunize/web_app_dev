import React from "react";
import { ImageUploader } from "../property/imageUploader";

interface PropertyImagesProps {
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>; // Asegúrate de que setImages tenga el tipo correcto
}

export const PropertyImages: React.FC<PropertyImagesProps> = ({ images, setImages }) => {
  const handleImagesUploaded = (urls: string[]) => {
    setImages((prevImages: string[]) => [...prevImages, ...urls]); // Define el tipo de prevImages como string[]
  };

  const handleImageRemoved = (publicId: string) => {
    console.log(`Image removed with public ID: ${publicId}`);
    // Aquí puedes manejar la eliminación de imágenes si es necesario
  };

  return (
    <div>
      <ImageUploader onImagesUploaded={handleImagesUploaded} onImageRemoved={handleImageRemoved} />
      {/* Aquí puedes mostrar las imágenes subidas si es necesario */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
        {images.map((url, index) => (
          <img key={index} src={url} alt={`Uploaded ${index}`} className="object-cover w-full h-24 rounded-lg" />
        ))}
      </div>
    </div>
  );
};
