import React from 'react';
import arrowUrl from "../../assets/arrowUrl.svg";
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';


interface BlogCardProps {
  imageUrl: string;
  title: string;
  description: string;
  day_posted: string;
  article_id: number;
}

export const BlogCard: React.FC<BlogCardProps> = ({ imageUrl, title, description, article_id, day_posted }) => {
  const navigate = useNavigate();
  const formattedDate = new Date(day_posted).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const sanitizedDescription = DOMPurify.sanitize(description);


  return (
    <article className="flex flex-col my-5 overflow-hidden transition-transform duration-300">
      <aside className="w-full h-[300px]">
        <img
          alt={title}
          src={imageUrl}
          className="w-full h-full object-cover rounded-lg"
        />
      </aside>
      <div className="p-6 flex flex-col justify-between">
        <header>
          <p className="text-[#ADD244] mb-3 font-bold">Investing fundamentals</p>
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <span 
              className="cursor-pointer rounded-full bg-gray-100 hover:bg-gray-300 p-2 inline-flex items-center justify-center"
              onClick={() => navigate(`article/${article_id}`)}
            >
              <img 
                alt='arrow-url-redirect' 
                src={arrowUrl} 
              />
            </span>
          </div>
          <p className="text-gray-600 mb-4 line-clamp-3">
            <span dangerouslySetInnerHTML={{ __html: sanitizedDescription }} />
          </p>
        </header>
        <footer>
          <span className="text-sm text-gray-500 font-bold">{formattedDate}</span>
        </footer>
      </div>
    </article>
  );
};
