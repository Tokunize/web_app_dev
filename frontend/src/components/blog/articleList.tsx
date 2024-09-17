import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { AllArticlesCard } from './allArticlesCard'; 
import { Button } from '../ui/button';

interface Article {
  id: number; 
  slug: string;
  title: string;
  first_section: string;
  image_urls: { url: string }[];  
  views: number
}

export const ArticleList = () => {
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getAllArticles = async () => {
    const apiUrl = `${import.meta.env.VITE_APP_BACKEND_URL}blog/articles/`;
    try {
      const accessToken = await getAccessTokenSilently();
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      };
      const response = await axios.get<Article[]>(apiUrl, config);
      setArticles(response.data);
      console.log(response.data);
      
    } catch (err) {
      setError('Error fetching articles. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllArticles();
  }, [getAccessTokenSilently]);

  const handleArticleDeleted = (id: number) => {
    setArticles(articles.filter(article => article.id !== id));
  };

  return (
    <section className="bg-gray-100 rounded">
      <Button onClick={() => navigate('/blog/')} className="m-6">
        Go to the Blog
      </Button>

      {loading ? (
        <div className="p-6 text-center">Loading...</div>
      ) : error ? (
        <div className="p-6 text-center text-red-500">{error}</div>
      ) : (
        <div className="p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <AllArticlesCard
              key={article.id} 
              views={article.views}
              imageSrc={article.image_urls[0].url || 'https://via.placeholder.com/400'}
              title={article.title}
              link={`/blog/article/${article.id}`}
              articleId={article.id} 
              onArticleDeleted={handleArticleDeleted}
            />
          ))}
        </div>
      )}
    </section>
  );
};
