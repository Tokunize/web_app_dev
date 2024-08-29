import React, { useState } from 'react';
import { Documents } from './documents';
import { Activity } from './activity';
import { Finantial } from './finantial';
import { Overview } from './overview';

export const PropertyAccordion: React.FC = () => {
  // Define type for the index state
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  // Handle click event
  const handleClick = (index: number) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className="p-4">
      {/* Accordion Header */}
      <div className="flex space-x-4 mb-4">
        <button
          className={`p-2 border rounded ${activeIndex === 0 ? 'bg-blue-500 text-white' : 'bg-white'}`}
          onClick={() => handleClick(0)}
        >
          Activity
        </button>
        <button
          className={`p-2 border rounded ${activeIndex === 1 ? 'bg-blue-500 text-white' : 'bg-white'}`}
          onClick={() => handleClick(1)}
        >
          Component 2
        </button>
        <button
          className={`p-2 border rounded ${activeIndex === 2 ? 'bg-blue-500 text-white' : 'bg-white'}`}
          onClick={() => handleClick(2)}
        >
          Component 3
        </button>
        <button
          className={`p-2 border rounded ${activeIndex === 3 ? 'bg-blue-500 text-white' : 'bg-white'}`}
          onClick={() => handleClick(3)}
        >
          Component 4
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
