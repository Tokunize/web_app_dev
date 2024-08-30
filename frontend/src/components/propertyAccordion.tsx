import React, { useState } from 'react';
import { Documents } from './documents';
import { Activity } from './activity';
import { Finantial } from './finantial';
import { Overview } from './overview';

export const PropertyAccordion: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const handleClick = (index: number) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div>
      {/* Accordion Header */}
      <div className="flex space-x-4 mb-4">
        <button
          className={`p-2 border-b-2 transition-all ease-in-out duration-300 ${activeIndex === 0 ? 'border-black' : 'border-transparent'}`}
          onClick={() => handleClick(0)}
        >
          Activity
        </button>
        <button
          className={`p-2 border-b-2 transition-all ease-in-out duration-300 ${activeIndex === 1 ? 'border-black' : 'border-transparent'}`}
          onClick={() => handleClick(1)}
        >
          Finantial
        </button>
        <button
          className={`p-2 border-b-2 transition-all ease-in-out duration-300 ${activeIndex === 2 ? 'border-black' : 'border-transparent'}`}
          onClick={() => handleClick(2)}
        >
          Activity
        </button>
        <button
          className={`p-2 border-b-2 transition-all ease-in-out duration-300 ${activeIndex === 3 ? 'border-black' : 'border-transparent'}`}
          onClick={() => handleClick(3)}
        >
          Documents
        </button>
      </div>

      {/* Accordion Content */}
      <div>
        {activeIndex === 0 && <Overview />}
        {activeIndex === 1 && <Activity />}
        {activeIndex === 2 && <Finantial />}
        {activeIndex === 3 && <Documents />}
      </div>
    </div>
  );
};
