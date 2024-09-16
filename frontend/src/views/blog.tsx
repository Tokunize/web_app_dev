import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { BlogCard } from "@/components/blog/blogCard";

interface BlogPost {
  id: number;
  image_urls: string[]; 
  title: string;
  description: string;
  day_posted: string;
}

export const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}blog/articles/public/`);        
        console.log(response.data);
        
        setBlogPosts(response.data);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      }
    };

    fetchBlogPosts();
  }, []);

  return (
    <section>
      <div className="bg-[#F9FAFB] text-center space-y-5 py-[60px]">
        <p className="font-bold text-[#A0CC29] text-sm">Our Blog</p>
        <h2 className="font-bold text-4xl">Welcome to Tokunize Insights</h2>
        <p className="text-[#667085] text-medium w-[50%] mx-auto">
          Sign up for the Tokunize platform to gain full access to our product offerings, thought leadership and more.
        </p>
      </div>
      <div className="flex mt-[64px] px-[60px]">
        <aside className="flex flex-col space-y-3 pr-[64px]">
          <p className="text-[#C8E870] text-sm font-bold">Blog Categories</p>
          <Button>View All</Button>
          <Button>Investing Fundamentals</Button>
        </aside>
        <article className="w-[80%] mx-auto">
          {blogPosts.length > 0 ? (
            blogPosts.map((post) => (
              <BlogCard
                key={post.id}
                imageUrl={post.image_urls[0]} 
                title={post.title}
                description={post.description}
                day_posted={post.day_posted}
                article_id={post.id}
              />
            ))
          ) : (
            <p className="text-center">No blog posts available</p>
          )}
        </article>
      </div>
    </section>
  );
};
