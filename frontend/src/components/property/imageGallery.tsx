import React from 'react';
import "../../styles/imageGallery.css"

interface ImageGalleryProps {
  images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  return (
    <div className="image-gallery">
      {images.map((imageUrl, index) => (
        <div key={index} className="image-item">
          <img src={imageUrl} alt={`Property Image ${index + 1}`} className="image" />
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;
