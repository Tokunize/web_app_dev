import { Button } from "@/components/ui/button"
import { HeroBlog } from "@/components/blog/heroBlog"
import { BlogCard } from "@/components/blog/blogCard"

export const Blog = () =>{
    return(
        <section className="">
            <HeroBlog/>
            <div className="flex mt-[64px] px-[60px]">
                <aside className="flex flex-col  space-y-3 pr-[64px]">
                    <p className="text-[#C8E870] text-sm font-bold">Blog Categories</p>
                    <Button>View All</Button>
                    <Button>Investing Fundamentals</Button>
                    <Button>Market Insights</Button>
                    <Button>Podcast</Button>
                </aside>
                <article  className="w-[80%] mx-auto">
                    <BlogCard/>
                </article>
            </div>
        </section>
    )
}