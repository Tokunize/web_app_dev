
import React, { useState } from 'react';
import useFetchPropertyDetails from './property/getDetailsHook';
import { Documents } from './documents';
import { Activity } from './activity';
import { Finantial } from './financial';
import { Overview } from './overview';

interface PropertyAccordionProps {
  property_id: number;
}

export const PropertyAccordion: React.FC<PropertyAccordionProps> = ({ property_id }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  
  // Define view types based on index
  const viewTypes = ['overview', 'activity', 'financial', 'documents'];
  const viewType = viewTypes[activeIndex ?? 0];

  const { data, loading, error } = useFetchPropertyDetails(property_id, viewType);

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
          Overview
        </button>
        <button
          className={`p-2 border-b-2 transition-all ease-in-out duration-300 ${activeIndex === 1 ? 'border-black' : 'border-transparent'}`}
          onClick={() => handleClick(1)}
        >
          Financial
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
        {activeIndex === 0 && (
          <Overview/>
        )}
        {activeIndex === 1 && (
          <Finantial data={data} loading={loading} error={error} />
        )}
        {activeIndex === 2 && (
          <Activity data={data} property_id={property_id} />

        )}
        {activeIndex === 3 && (
          <Documents />
        )}
      </div>
    </div>
  );
};
