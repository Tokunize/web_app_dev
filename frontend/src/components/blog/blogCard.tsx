import React from 'react';
import arrowUrl from "../../assets/arrowUrl.svg"
import { useNavigate } from 'react-router-dom';


interface BlogCardProps {
  imageUrl: string; 
  title: string;
  description: string;
  day_posted: string;
  article_id:number
}

export const BlogCard: React.FC<BlogCardProps> = ({ imageUrl, title, description,article_id, day_posted }) => {
  const navigate = useNavigate()
  const formattedDate = new Date(day_posted).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });



  return (
    <article className="flex flex-col my-5 md:flex-row overflow-hidden transition-transform duration-300 hover:scale-105">
      <aside className="w-full h-[300px]">
        <img
          alt={title}
          src={imageUrl} 
          className="w-full h-full object-cover rounded-lg"
        />
      </aside>
      <div className="w-full p-6 flex flex-col justify-between">
        <header>
          <p className="text-[#ADD244] font-bold">Investing fundamentals</p>
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
            <img alt='arrow-url-redirect' onClick={()=>navigate(`article/${article_id}`)} src={arrowUrl} />
          </div>
          <p className="text-gray-600 mb-4">
            {description}
          </p>
        </header>
        <footer>
          <span className="text-sm text-gray-500 font-bold">{formattedDate}</span>
        </footer>
      </div>
    </article>
  );
};
