import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { FaTimes, FaEye } from 'react-icons/fa';  // Import FaEdit
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import CreateArticle from '../forms/createArticleForm';

interface AllArticlesCardProps {
  imageSrc: string;
  title: string;
  link: string;
  articleId: number; 
  onArticleDeleted: (id: number) => void;
  views: number; 
}
interface Article {
  id: number;
  slug: string;
  title: string;
  first_section: string;
  image_urls: string[];
  views: number;
}
export const AllArticlesCard: React.FC<AllArticlesCardProps> = ({ imageSrc, title, link, articleId, onArticleDeleted, views }) => {
  const { getAccessTokenSilently } = useAuth0();
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [articleData, setArticleData] = useState<Article | null>(null); 
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      const token = await getAccessTokenSilently();
      await axios.delete(`${import.meta.env.VITE_APP_BACKEND_URL}blog/articles/${articleId}/delete/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });     
      onArticleDeleted(articleId);
      setOpenDialog(false);
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  const handleEdit = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}blog/articles/${articleId}/`);
      setArticleData(response.data);
      setIsEditing(true);
    } catch (error) {
      console.error('Error fetching article data:', error);
    }
  };

  return (
    <>
      <article className="relative bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
        <img src={imageSrc} alt={title} className="w-full h-48 object-cover" />

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex items-center space-x-4">
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <button 
                onClick={() => setOpenDialog(true)}
                className="text-red-600 hover:text-red-800"
              >
                <FaTimes size={24} />
              </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-4xl mx-auto max-h-[90vh] overflow-auto p-4 rounded-lg bg-white">
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this article?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary" onClick={() => setOpenDialog(false)}>
                    Close
                  </Button>
                </DialogClose>
                <Button type="button" variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
        </div>
        <div className="px-4 mt-4 flex justify-between items-start">
          <h2 className="text-xl font-semibold mb-2">{title}</h2>
          <span className="text-gray-600 flex items-center space-x-1">
            <FaEye size={16} />
            <span>{views}</span>
          </span>
        </div>

        <div className="p-4 flex justify-between">
          <Button onClick={() => navigate(`${link}`)}>View Article</Button>
          <Button onClick={handleEdit}>Edit Article</Button>
        </div>
      </article>

      {/* Edit Article Dialog */}
      {isEditing && articleData && (
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="sm:max-w-4xl mx-auto max-h-[90vh] overflow-auto p-4 rounded-lg bg-white">
            <DialogHeader>
              <DialogTitle>Edit Article</DialogTitle>
            </DialogHeader>
            <CreateArticle 
              article={articleData}
              onClose={() => setIsEditing(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
