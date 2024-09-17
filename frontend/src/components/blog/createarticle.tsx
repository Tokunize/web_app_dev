import React, { useState, ChangeEvent, FormEvent } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { ImageUploaderBlog } from './imageUploaderBlog';
import ImageGallery from '../property/imageGallery';

interface Article {
  title: string;
  subtitle: string;
  first_section: string;
  second_section: string;
  third_section: string;
  image_urls?: { url: string; publicId: string }[];
}


const modules = {
  toolbar: [
    [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
    [{ size: [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'align': [] }],
    ['link'],
    ['clean']
  ]
};

interface CreateArticleProps {
  article?: Article;
  onClose: () => void;
}

const CreateArticle: React.FC<CreateArticleProps> = ({ article, onClose }) => {
  const { getAccessTokenSilently } = useAuth0();
  const cloudName = 'dhyrv5g3w';
  const uploadPreset = 'ptwmh2mt';

  const [articleData, setArticleData] = useState<Article>(article || {
    title: "",
    subtitle: "",
    first_section: "",
    second_section: "",
    third_section: ""
  });

  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<{ url: string; publicId: string }[]>(article?.image_urls || []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setArticleData(prev => ({ ...prev, [name]: value }));
  };

  const handleQuillChange = (name: string, value: string) => {
    setArticleData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageSelected = (files: File[]) => {
    setImages(files);
  };

  const handleImageRemoved = (index: number) => {
    setImages(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleReset = () => {
    setArticleData({
      title: "",
      subtitle: "",
      first_section: "",
      second_section: "",
      third_section: ""
    });
    setImages([]);
  };

  const uploadToCloudinary = async (file: File) => {
    const folder = "BlogJesus";
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', folder);

    const response = await fetch(url, { method: 'POST', body: formData });
    if (response.ok) {
      const data = await response.json();
      return { url: data.secure_url, publicId: data.public_id };
    } else {
      throw new Error('Failed to upload image');
    }
  };

  const deleteFromCloudinary = async (publicId: string) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}blog/delete-image/`, {
        public_id: publicId,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      return response.data.success; // Retorna true si la eliminación fue exitosa
    } catch (error) {
      console.error('Error eliminando la imagen:', error);
      return false;
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const imageUrls: { url: string; publicId: string }[] = [];

    try {
      // Subir nuevas imágenes
      for (const file of images) {
        const { url, publicId } = await uploadToCloudinary(file);
        imageUrls.push({ url, publicId });
      }

      // Combinar imágenes existentes (sin las eliminadas) con las nuevas imágenes
      const updatedImageUrls = existingImages.concat(imageUrls);
      
      const articleDataToSave = {
        ...articleData,
        image_urls: updatedImageUrls,
        slug: articleData.title.toLowerCase().replace(/ /g, '-'),
      };

      const accessToken = await getAccessTokenSilently();

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      };

      try {
        if (article) {
          await axios.put(`${import.meta.env.VITE_APP_BACKEND_URL}blog/articles/${article.id}/edit/`, articleDataToSave, config);
        } else {
          await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}blog/articles/`, articleDataToSave, config);
        }
        handleReset();
        onClose();
      } catch (error) {
        console.error("Error saving article:", error);
      }
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  const handleDeleteImage = async (publicId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const success = await deleteFromCloudinary(publicId);
      if (success) {
        const updatedImages = existingImages.filter(img => img.publicId !== publicId);
        setExistingImages(updatedImages);

        const accessToken = await getAccessTokenSilently();
        const articleDataToSave = {
          ...articleData,
          image_urls: updatedImages,
          slug: articleData.title.toLowerCase().replace(/ /g, '-'),
        };

        const config = {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        };

        await axios.put(`${import.meta.env.VITE_APP_BACKEND_URL}blog/articles/${article?.id}/edit/`, articleDataToSave, config);
        console.log('Artículo actualizado con éxito.');
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  return (
    <form id="create-article" onSubmit={handleSubmit} className="space-y-6 p-5 rounded bg-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Article Title</label>
          <input
            id="title"
            name="title"
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter Article Title"
            value={articleData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700">Article Subtitle</label>
          <input
            id="subtitle"
            name="subtitle"
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter Article Subtitle"
            value={articleData.subtitle}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="first_section" className="block text-sm font-medium text-gray-700">Article First Section</label>
        <ReactQuill
          id="first_section"
          name="first_section"
          className="mt-1 bg-white"
          modules={modules}
          value={articleData.first_section}
          onChange={(value) => handleQuillChange('first_section', value)}
          required
        />
      </div>

      <div>
        <label htmlFor="second_section" className="block text-sm font-medium text-gray-700">Article Second Section</label>
        <ReactQuill
          id="second_section"
          name="second_section"
          className="mt-1 bg-white"
          modules={modules}
          value={articleData.second_section}
          onChange={(value) => handleQuillChange('second_section', value)}
          required
        />
      </div>

      <div>
        <label htmlFor="third_section" className="block text-sm font-medium text-gray-700">Article Third Section</label>
        <ReactQuill
          id="third_section"
          name="third_section"
          className="mt-1 bg-white"
          modules={modules}
          value={articleData.third_section}
          onChange={(value) => handleQuillChange('third_section', value)}
          required
        />
      </div>

      <ImageUploaderBlog
        onImagesSelected={handleImageSelected}
        onImageRemoved={handleImageRemoved}
      />

      <ImageGallery 
        images={existingImages} 
        onDelete={handleDeleteImage} 
      />

      <div className="flex justify-between items-center mt-6">
        <button type="reset" className="px-4 py-2 bg-gray-500 text-white rounded-md" onClick={handleReset}>
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
          Save
        </button>
      </div>
    </form>
  );
};

export default CreateArticle;
