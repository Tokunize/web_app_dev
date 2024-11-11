"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RejectPropertyForm } from "./forms/rejectPropertyForm";

// Definition of the property interface
interface Property {
  id: string;
  image: string;
  title: string;
  location: string;
  listingPrice: number;
  ownershipPercentage: number;
  status?: string;
  listingDate?: string;
  investmentCategory?: string;
  propertyType?: string;
}


interface AcceptPropertyProps {
  allPropertiesUnderReview: Property[]; // Array of properties under review
}

export const AcceptProperty: React.FC<AcceptPropertyProps> = ({
  allPropertiesUnderReview,
}) => {
  const [showRejectForm, setShowRejectForm] = useState<boolean>(false); // State to control the visibility of the rejection form
  const [currentPropertyIndex, setCurrentPropertyIndex] = useState(0); // State to manage the current property index in the carousel

  const handleCancel = () => {    
    setShowRejectForm(true); // Show the rejection form when cancelling
  };

  // Function to handle carousel navigation
  const handlePrevious = () => {
    setCurrentPropertyIndex((prevIndex) =>
      prevIndex === 0 ? allPropertiesUnderReview.length - 1 : prevIndex - 1
    );
    setShowRejectForm(false); // Hide the rejection form
  };

  const handleNext = () => {
    setCurrentPropertyIndex((prevIndex) =>
      prevIndex === allPropertiesUnderReview.length - 1 ? 0 : prevIndex + 1
    );
    setShowRejectForm(false); // Hide the rejection form
  };

  const currentProperty = allPropertiesUnderReview[currentPropertyIndex];

  return (
    <div className=" overflow-y-auto h-auto">
        
         {/* Navigation arrows */}
         <div className="flex justify-between items-center mb-4">
           <Button
             onClick={handlePrevious}
             className="p-2 bg-gray-200 hover:bg-gray-300 h-8 w-8 rounded-full"
           >
             &#8592; {/* Left arrow */}
           </Button>
          
           <p className="text-sm text-gray-500">
             {currentPropertyIndex + 1} / {allPropertiesUnderReview.length}
           </p>
          
           <Button
             onClick={handleNext}
             className="p-2 bg-gray-200 hover:bg-gray-300 h-8 w-8 rounded-full"
           >
             &#8594; {/* Right arrow */}
           </Button>
         </div>
             <div className="relative w-full h-48 overflow-hidden mb-4">
          <img
            alt="property-image"
            src={currentProperty.image}
            className="w-full h-full object-cover rounded-md transition-transform duration-300 transform"
          />
        </div>
             <span className="flex items-center space-x-4">
           <p className="font-bold text-lg">{currentProperty.title}</p>
           <p className="text-sm text-gray-500">{currentProperty.location}</p>
         </span>

         {showRejectForm ? (
           <RejectPropertyForm propertyId={currentProperty.id} />
         ) : (
           <ul className="mt-4 space-y-2">
             <li className="flex justify-between">
               <span className="font-bold">Price:</span>
               <span>{currentProperty.listingPrice}</span>
             </li>
             <li className="flex justify-between">
               <span className="font-bold">Ownership:</span>
               <span>{currentProperty.ownershipPercentage}%</span>
             </li>
           </ul>
         )}

         {/* Dialog footer buttons */}
           {showRejectForm ? (
             <Button variant="outline" onClick={() => setShowRejectForm(false)}>
               Go Back
             </Button>
           ) : (
             <>
               <Button variant="outline" className="w-1/3" onClick={handleCancel}>
                 Reject
               </Button>
               <Button variant="default" className="w-2/3">Approve</Button>
             </>
           )}
        </div>

  );
};
