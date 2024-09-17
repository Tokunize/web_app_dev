import { useEffect, useState } from 'react';
import axios from 'axios';
import { BlogCard } from "@/components/blog/blogCard";
import BackgroundImage from "../assets/background-blog.png";

interface BlogPost {
  id: number;
  image_urls: { url: string }[];  
  title: string;
  first_section: string;
  day_posted: string;
}

export const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

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

  const filteredPosts = blogPosts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.first_section.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section>
      <div className="bg-[#F9FAFB] text-center space-y-5 py-[60px]">
        <p className="font-bold text-[#A0CC29] text-sm">Our Blog</p>
        <h2 className="font-bold text-4xl">Welcome to Tokunize Insights</h2>
        <p className="text-[#667085] text-medium w-[90%] md:w-[50%] mx-auto">
          Sign up for the Tokunize platform to gain full access to our product offerings, thought leadership and more.
        </p>
      </div>
      <div className="flex flex-col md:flex-row mt-[64px] px-[16px] md:px-[60px]">
        <aside className="flex w-[30%] flex-col space-y-3 pr-0 md:pr-[64px] mb-8 md:mb-0">
          <p className="text-[#C8E870] text-sm font-bold">Blog Categories</p>
          {/* Search Bar */}
          <div className="relative mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search blog posts..."
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#A0CC29] focus:border-transparent"
            />
          </div>
          <ul className="space-y-2">
            <li className="bg-[#F3F4F7] w-full font-semibold rounded-md px-3 py-1">View All</li>
          </ul>
        </aside>
        <article className="w-full">
          <article className="flex flex-col lg:flex-row overflow-hidden transition-transform duration-300 mb-8">
            <aside className="w-full lg:w-[60%] h-[250px] lg:h-[380px] mb-4 md:mb-0">
              <img
                alt={"tokunize-background"}
                src={BackgroundImage}
                className="w-full h-full object-cover rounded-lg"
              />
            </aside>
            <div className="w-full lg:w-[40%] p-4 md:p-6 flex flex-col justify-between">
              <header className="space-y-4">
                <p className="text-[#ADD244] font-bold">Investing fundamentals</p>
                <div className="flex flex-col md:flex-row justify-between items-start mb-2">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">{"The Ultimate Guide to Tokenising Real-World Assets (RWAs)"}</h2>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Tokenisation is the process of creating digital tokens on a blockchain or distributed ledger that represent ownership, or fractional ownership, of physical or digital assets.
                </p>
              </header>
              <footer>
                <span className="text-sm text-gray-500 font-bold"></span>
              </footer>
            </div>
          </article>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mx-auto">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <BlogCard
                  key={post.id}
                  imageUrl={post.image_urls[0].url}
                  title={post.title}
                  description={post.first_section}
                  day_posted={post.day_posted}
                  article_id={post.id}
                />
              ))
            ) : (
              <p className="text-center col-span-2">No blog posts available</p>
            )}
          </div>
        </article>
      </div>
    </section>
  );
};
