import React, { useState } from 'react';

import { Cloudinary } from '@cloudinary/url-gen';

// Cloudinary Config
const cloudName = 'dhyrv5g3w';
const uploadPreset = 'ptwmh2mt';

export const ImageUploader = () => {
  const [files, setFiles] = useState({
    image: null,
    imagePreview: null,
  });

  // Función para manejar cambios en el archivoye
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateFileState(file);
      previewImage(file);
    }
  };

  // Función para manejar el drop de archivos
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      updateFileState(file);
      previewImage(file);
    }
  };

  // Función para actualizar el estado del archivo
  const updateFileState = (file: File) => {
    setFiles({ image: file, imagePreview: URL.createObjectURL(file) });
  };

  // Función para previsualizar la imagen
  const previewImage = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setFiles(prev => ({ ...prev, imagePreview: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  // Función para cargar la imagen en Cloudinary
  const uploadToCloudinary = async (file: File) => {
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    const response = await fetch(url, { method: 'POST', body: formData });
    if (response.ok) {
      const data = await response.json();
      return data.secure_url;
    } else {
      throw new Error('Failed to upload image');
    }
  };

  // Función para manejar la subida de la imagen
  const handleUpload = async () => {
    if (files.image) {
      try {
        const imageUrl = await uploadToCloudinary(files.image);
        console.log('Image URL:', imageUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  return (
    <div className="bg-red-500 flex flex-col">
      <div
        className={` bg-green-500 flex  dropzone p-3 rounded ${files.imagePreview ? 'has-image' : ''}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {files.imagePreview ? (
          <img src={files.imagePreview} alt="Uploaded" className="uploaded-image mb-3" />
        ) : (
            <div className="text-center border-2 border-dotted  p-4">
            <p>Click to upload or drag and drop</p>
            <input
              type="file"
              id="upload-file"
              name="uploaded-file"
              className="d-none bg-red-500"
              onChange={handleFileChange}
            />
            {/* <label htmlFor="upload-file hidden" className="btn btn-outline-primary">
              Choose File
            </label> */}
            <p className="message mt-3">
              {files.image ? `${files.image.name}, ${files.image.size} bytes` : ''}
            </p>
          </div>
        )}
      </div>
      <button type="button" className="btn btn-primary mt-4" onClick={handleUpload}>
        Upload
      </button>
    </div>
  );
};

