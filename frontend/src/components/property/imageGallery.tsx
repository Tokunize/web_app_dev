import React from 'react';
import "../../styles/imageGallery.css";

interface ImageGalleryProps {
  images: { url: string; publicId: string }[]; 
  onDelete: (publicId: string) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, onDelete }) => {
  return (
    <div className="image-gallery">
      {images.map((image, index) => (
        <div key={index} className="image-item relative">
          <img src={image.url} alt={`Image ${index + 1}`} className="image" />
          <button 
            className="delete-button"
            onClick={(e) => onDelete(image.publicId, e)}
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;
