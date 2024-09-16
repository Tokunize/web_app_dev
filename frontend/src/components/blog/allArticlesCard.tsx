
import React from 'react';
import { Link } from 'react-router-dom'; 

interface AllArticlesCardProps {
  imageSrc: string;
  title: string;
  description: string;
  link: string;
}

export const AllArticlesCard: React.FC<AllArticlesCardProps> = ({ imageSrc, title, description, link }) => {
  return (
    <article className="max-w-sm mx-auto bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
      <img src={imageSrc} alt={title} className="w-full h-48 object-cover" />

      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>

        <p className="text-gray-600 mb-4 line-clamp-3">{description}</p>

        <Link to={link} className="text-blue-600 hover:text-blue-800 flex items-center">
          <span>View Article</span>
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </Link>
      </div>
    </article>
  );
};
