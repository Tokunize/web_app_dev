import React from 'react';
import investor1 from "../../assets/investor1.png"
import investor2 from "../../assets/investor2.png"
import investor3 from "../../assets/investor3.svg"
import { Carousel } from 'flowbite-react';


export const InvestorCarousel: React.FC = () => {
    const slides = [
      {
        title: 'Explore Investment Opportunities!',
        description: 'Browse our marketplace to discover your next commercial real estate investment.',
        imageUrl: investor3,
      },
      {
        title: 'Invest with Ease.',
        description: 'Buy equity in returns-optimised assets with just a few clicks. We take care of everything—from legal documentation to tax and payment processing.',
        imageUrl: investor2,
      },
      {
        title: 'Enjoy Flexibility and Liquidity',
        description: 'No lock-ins. Sell your investment anytime on the secondary market and withdraw your capital instantly. It’s that simple.',
        imageUrl: investor1,
      },
    ];
  
    return (
      <article className="p-6 min-w-[800px] flex flex-col w-full custom-landing-carousel">
        <h4 className="font-bold text-2xl mb-[40px] text-left">I am an accredited investor,</h4>
        <Carousel slideInterval={5000} className="w-[500px]  h-[480px] mb-[80px]">
          {slides.map((slide, index) => (
            <div key={index} className="flex flex-col justify-center items-center text-center h-full p-6">
              <h2 className="text-2xl font-semibold mb-4">{slide.title}</h2>
              <p className="text-gray-600 mb-6">{slide.description}</p>
              <div className="flex justify-center items-center w-full h-[300px]">
                <img
                  src={slide.imageUrl}
                  alt={slide.title}
                  className="max-h-full max-w-full object-contain rounded-lg"
                />
              </div>
            </div>
          ))}
        </Carousel>
      </article>
    );
  };
  