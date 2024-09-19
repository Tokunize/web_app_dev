import React, { useState } from 'react';

interface ImageFile {
  file: File;
  previewUrl: string;
  temporaryId: string;
}

interface ImageUploaderProps {
  onImagesSelected: (files: ImageFile[]) => void; // Notificar al componente padre sobre los archivos seleccionados
  onImageRemoved: (index: number) => void; // Notificar al componente padre sobre la eliminación de una imagen
}

export const ImageUploaderBlog: React.FC<ImageUploaderProps> = ({ onImagesSelected, onImageRemoved }) => {
  const [files, setFiles] = useState<ImageFile[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      handleFiles(Array.from(selectedFiles));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles) {
      handleFiles(Array.from(droppedFiles));
    }
  };

  const handleFiles = (newFiles: File[]) => {
    const filePreviews = newFiles.map((file, index) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      temporaryId: `${Date.now()}-${index}` // Asignar un ID único temporal a cada imagen
    }));

    setFiles((prevFiles) => [...prevFiles, ...filePreviews]);
    onImagesSelected(filePreviews); // Notificar al componente padre sobre los archivos seleccionados
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    onImageRemoved(index); // Notificar al componente padre sobre la eliminación de la imagen
  };

  return (
    <div className="flex flex-col items-center p-6">
      <div
        className="flex flex-col justify-center items-center w-full max-w-lg p-6 border-2 border-dashed border-gray-300 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow ease-in-out duration-300 cursor-pointer"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="upload-file"
          name="uploaded-file"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        <label htmlFor="upload-file" className="text-center cursor-pointer">
          <p className="text-gray-500 font-medium">Click to upload or drag & drop multiple images</p>
          <p className="text-gray-400 text-sm mt-2">PNG, JPG, GIF up to 5MB</p>
        </label>
      </div>

      {files.length > 0 && (
        <div className="w-full max-w-4xl mt-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Image Order Previews</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {files.map((file, index) => (
              <div
                key={file.temporaryId}
                className="relative rounded-lg border border-gray-200 overflow-hidden shadow-sm"
              >
                <img
                  src={file.previewUrl}
                  alt={`Preview ${index}`}
                  className="object-cover w-full h-24"
                />
                <button
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                  onClick={() => removeFile(index)}
                >
                  &times;
                </button>
                <p className="absolute bottom-0 left-0 right-0 bg-gray-900 bg-opacity-75 text-white text-xs text-center py-1 truncate">
                  {file.file.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
