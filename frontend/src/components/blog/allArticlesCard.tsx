import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { FaTimes } from 'react-icons/fa';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

interface AllArticlesCardProps {
  imageSrc: string;
  title: string;
  link: string;
  articleId: number; 
  onArticleDeleted: (id: number) => void; 
}

export const AllArticlesCard: React.FC<AllArticlesCardProps> = ({ imageSrc, title, link, articleId, onArticleDeleted }) => {
  const { toast } = useToast()  // Import useToast hook
  const { getAccessTokenSilently } = useAuth0();
  const [openDialog, setOpenDialog] = useState(false);
  const navigate= useNavigate()

  const handleDelete = async () => {
    try {
      const token = await getAccessTokenSilently();
      await axios.delete(`${import.meta.env.VITE_APP_BACKEND_URL}blog/articles/${articleId}/delete/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      toast({
        title: "Deleted!",
        description: "You deleted successfully this article!",
        action: (
          <ToastAction altText="Close">Close</ToastAction>
        ),
      });
      onArticleDeleted(articleId); // Llamar a la función de eliminación
      setOpenDialog(false); // Cerrar el diálogo
      
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Failed to delete the article');
    }
  };

  return (
    <article className="relative bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
      <img src={imageSrc} alt={title} className="w-full h-48 object-cover" />

      {/* Delete Button */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <button 
            onClick={() => setOpenDialog(true)}
            className="absolute top-2 right-2 text-red-600 hover:text-red-800"
          >
            <FaTimes size={24} />
          </button>
        </DialogTrigger>

        {/* Dialog for Deletion Confirmation */}
        <DialogContent className="sm:max-w-md">
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

      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <Button onClick={()=> navigate(`${link}`)}>View Article</Button>
      </div>
    </article>
  );
};
