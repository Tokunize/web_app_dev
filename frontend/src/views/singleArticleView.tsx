import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import DOMPurify from "dompurify";

export interface Article {
  id: number;
  title: string;
  subtitle: string;
  first_section: string;
  second_section: string;
  third_section: string;
  image_urls: string[];
}

export const SingleArticleView: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const [article, setArticle] = useState<Article | null>(null); 
  const [error, setError] = useState<string | null>(null); 
  const [isLoading, setIsLoading] = useState<boolean>(true); 

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) {
        setError("Article ID is missing");
        setIsLoading(false);
        return;
      }

      const apiUrl = `${import.meta.env.VITE_APP_BACKEND_URL}blog/articles/${id}/`;
      try {
        const response = await axios.get<Article>(apiUrl);
        setArticle(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  if (!article) {
    return <div className="text-center">No article found</div>;
  }

  const sanitizeHTML = (html: string) => 
    DOMPurify.sanitize(html, { USE_PROFILES: { html: true }, ALLOWED_TAGS: ['ol', 'li', 'ul', 'p', 'img'] });

  return (
    <article className="px-8 mt-24" id="singleArticleView">
      <header className="text-center mb-8">
        <p className="font-bold text-lg text-[#C8E870] mb-4">Investing Fundamentals</p>
        <h1 className="text-4xl md:w-[60%] mx-auto font-bold mb-8">{article.title}</h1>
      </header>

      {/* Main Image */}
      <figure className="mb-8">
        <img
          src={article.image_urls[1] || 'fallback-image-url.jpg'}
          alt={article.title}
          className="w-full h-[350px] object-cover"
        />
      </figure>

      <section className="md:w-3/4 mx-auto py-8">
        {/* First Section */}
        <article className="mb-8">
          <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(article.first_section) }} />
        </article>

        {/* Image between sections */}
        {article.image_urls[0] && (
          <figure className="my-8">
            <img
              src={article.image_urls[0] || 'fallback-image-url.jpg'}
              alt="Illustrative image"
              className="w-full h-[300px] object-cover"
            />
          </figure>
        )}

        {/* Second Section */}
        <article className="mb-8">
          <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(article.second_section) }} />
        </article>

        {/* Image between sections */}
        {article.image_urls[2] && (
          <figure className="my-8">
            <img
              src={article.image_urls[2] || 'fallback-image-url.jpg'}
              alt="Illustrative image"
              className="w-full h-[300px] object-cover"
            />
          </figure>
        )}

        {/* Third Section */}
        <article>
          <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(article.third_section) }} />
        </article>
      </section>
    </article>
  );
};
