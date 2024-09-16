import { useState, ChangeEvent, FormEvent } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface Article {
  title: string;
  subtitle: string;
  description: string;
  second_paragraph: string;
  third_section: string
}

interface FileState {
  image: File | null;
  secondImage: File | null;
  imagePreview: string | null;
  secondImagePreview: string | null;
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

const CreateArticle = () => {
  const cloudName = 'dhyrv5g3w';
  const uploadPreset = 'ptwmh2mt';

  const [article, setArticle] = useState<Article>({
    title: "",
    subtitle: "",
    description: "",
    second_paragraph: "",
    third_section:""
  });

  const [files, setFiles] = useState<FileState>({
    image: null,
    secondImage: null,
    imagePreview: null,
    secondImagePreview: null,
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setArticle(prev => ({ ...prev, [name]: value }));
  };

  const handleQuillChange = (name: string, value: string) => {
    setArticle(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (name: string, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateFileState(name, file);
      previewImage(file, name === 'image' ? 'imagePreview' : 'secondImagePreview');
    }
  };

  const handleDrop = (name: string, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      updateFileState(name, file);
      previewImage(file, name === 'image' ? 'imagePreview' : 'secondImagePreview');
    }
  };

  const handleDropzoneDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const previewImage = (file: File, previewName: keyof FileState) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setFiles(prev => ({ ...prev, [previewName]: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const updateFileState = (name: keyof FileState, file: File) => {
    setFiles(prev => ({ ...prev, [name]: file }));
  };

  const handleReset = () => {
    setArticle({
      title: "",
      subtitle: "",
      description: "",
      second_paragraph: "",
      third_section:"",
    });
    setFiles({
      image: null,
      secondImage: null,
      imagePreview: null,
      secondImagePreview: null,
    });
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
      return data.secure_url;
    } else {
      throw new Error('Failed to upload image');
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let image_url = '';
    let image_url_two = '';

    if (files.image) {
      try {
        image_url = await uploadToCloudinary(files.image);
      } catch (error) {
        console.error("Error uploading image:", error);
        return;
      }
    }

    if (files.secondImage) {
      try {
        image_url_two = await uploadToCloudinary(files.secondImage);
      } catch (error) {
        console.error("Error uploading second image:", error);
        return;
      }
    }

    const articleData = {
      ...article,
      image_url,
      image_url_two,
      slug: article.title.toLowerCase().replace(/ /g, '-'),
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}blog/post/create/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articleData),
      });

      if (response.ok) {
        handleReset();
      } else {
        console.error("Error saving article:", response.statusText);
      }
    } catch (error) {
      console.error("Error saving article:", error);
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
            value={article.title}
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
            value={article.subtitle}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Article First Section</label>
        <ReactQuill
          id="description"
          name="description"
          className="mt-1 bg-white"
          modules={modules}
          value={article.description}
          onChange={(value) => handleQuillChange('description', value)}
          required
        />
      </div>

      <div>
        <label htmlFor="second_paragraph" className="block text-sm font-medium text-gray-700">Article Second Section</label>
        <ReactQuill
          id="second_paragraph"
          name="second_paragraph"
          className="mt-1  bg-white"
          modules={modules}
          value={article.second_paragraph}
          onChange={(value) => handleQuillChange('second_paragraph', value)}
          required
        />
      </div>

      <div>
        <label htmlFor="third_section" className="block text-sm font-medium text-gray-700">Article Third Section</label>
        <ReactQuill
          id="third_section"
          name="third_section"
          className="mt-1  bg-white"
          modules={modules}
          value={article.third_section}
          onChange={(value) => handleQuillChange('third_section', value)}
          required
        />
      </div>


      <div
        className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center"
        onDragOver={handleDropzoneDrag}
        onDrop={(e) => handleDrop('image', e)}
      >
        {files.imagePreview ? (
          <img src={files.imagePreview} alt="Uploaded" className="w-full h-48 object-cover mb-3" />
        ) : (
          <div>
            <p className="mb-3">Click to upload or drag and drop</p>
            <input
              type="file"
              id="upload-file"
              name="uploaded-file"
              className="hidden"
              onChange={(e) => handleFileChange('image', e)}
            />
            <label htmlFor="upload-file" className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
              Choose File
            </label>
          </div>
        )}
      </div>

      <div
        className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center"
        onDragOver={handleDropzoneDrag}
        onDrop={(e) => handleDrop('secondImage', e)}
      >
        {files.secondImagePreview ? (
          <img src={files.secondImagePreview} alt="Uploaded" className="w-full h-48 object-cover mb-3" />
        ) : (
          <div>
            <p className="mb-3">Click to upload or drag and drop</p>
            <input
              type="file"
              id="upload-second-file"
              name="uploaded-second-file"
              className="hidden"
              onChange={(e) => handleFileChange('secondImage', e)}
            />
            <label htmlFor="upload-second-file" className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
              Choose File
            </label>
          </div>
        )}
      </div>

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
