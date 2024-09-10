import React, { useState } from 'react';
import { FaEye } from 'react-icons/fa';
import { FaPen } from 'react-icons/fa';

import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from '../ui/dialog'; // Asegúrate de que estos componentes existen en '../ui/dialog'
import { useNavigate } from 'react-router-dom';

interface Property {
  id: number;
  title: string;
  bedrooms: number;
  bathrooms: number;
  price: number;
  location: string;
  property_type: string;
  size: number;
  year_built: number;
  description: string;
  details: Record<string, string>; // Asegúrate de que esto es un registro de pares clave-valor
  country: string;
  status: string; // Asegúrate de que el estado de la propiedad esté incluido
}

interface OwnerPropertyListProps {
  propertyList: Property[];
}

export const OwnerPropertyList: React.FC<OwnerPropertyListProps> = ({ propertyList }) => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const navigate = useNavigate()
  const underReviewProperties = propertyList.filter(prop => prop.status === 'under_review');
  const otherProperties = propertyList.filter(prop => prop.status !== 'under_review');

  const onViewDetails = (id: number) => {
    const property = propertyList.find(prop => prop.id === id) || null;
    setSelectedProperty(property);
  };

  const handleClose = () => {
    setSelectedProperty(null);
  };

  return (
    <section className="p-4">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Under Review</h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {underReviewProperties.length > 0 ? (
            underReviewProperties.map((item) => (
              <div
                key={item.id}
                className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between"
              >
                <h6 className="text-lg font-semibold">{item.title}</h6>
                <Dialog>
                  <FaPen 
                    onClick={()=>navigate(`/dashboard-property/${item.id}`)}
                  />
                  <DialogTrigger asChild>
                    <button
                      onClick={() => onViewDetails(item.id)}
                      className="text-blue-500 hover:text-blue-700 flex items-center"
                    >
                      <FaEye className="w-6 h-6" />
                      <span className="sr-only">View Details</span>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Property Details</DialogTitle>
                      <DialogDescription>
                        Here you can view the details of the selected property.
                      </DialogDescription>
                    </DialogHeader>
                    {selectedProperty && (
                      <div className="py-4 space-y-2">
                        <p><strong>ID:</strong> {selectedProperty.id}</p>
                        <p><strong>Title:</strong> {selectedProperty.title}</p>
                        <p><strong>Bedrooms:</strong> {selectedProperty.bedrooms}</p>
                        <p><strong>Bathrooms:</strong> {selectedProperty.bathrooms}</p>
                        <p><strong>Price:</strong> ${selectedProperty.price}</p>
                        <p><strong>Location:</strong> {selectedProperty.location}</p>
                        <p><strong>Property Type:</strong> {selectedProperty.property_type}</p>
                        <p><strong>Size:</strong> {selectedProperty.size} sq ft</p>
                        <p><strong>Year Built:</strong> {selectedProperty.year_built}</p>
                        <p><strong>Description:</strong> {selectedProperty.description}</p>
                        <p><strong>Country:</strong> {selectedProperty.country}</p>
                      </div>
                    )}
                    <DialogFooter>
                      <Button onClick={handleClose}>Close</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            ))
          ) : (
            <p>No properties under review.</p>
          )}
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Other Properties</h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {otherProperties.length > 0 ? (
            otherProperties.map((item) => (
              <div
                key={item.id}
                className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between"
              >
                <h6 className="text-lg font-semibold">{item.title}</h6>
                <Dialog>
                  <FaPen 
                    onClick={()=>navigate(`/dashboard-property/${item.id}`)}
                  />
                  <DialogTrigger asChild>
                    <button
                      onClick={() => onViewDetails(item.id)}
                      className="text-blue-500 hover:text-blue-700 flex items-center"
                    >
                      <FaEye className="w-6 h-6" />
                      <span className="sr-only">View Details</span>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Property Details</DialogTitle>
                      <DialogDescription>
                        Here you can view the details of the selected property.
                      </DialogDescription>
                    </DialogHeader>
                    {selectedProperty && (
                      <div className="py-4 space-y-2">
                        <p><strong>ID:</strong> {selectedProperty.id}</p>
                        <p><strong>Title:</strong> {selectedProperty.title}</p>
                        <p><strong>Bedrooms:</strong> {selectedProperty.bedrooms}</p>
                        <p><strong>Bathrooms:</strong> {selectedProperty.bathrooms}</p>
                        <p><strong>Price:</strong> ${selectedProperty.price}</p>
                        <p><strong>Location:</strong> {selectedProperty.location}</p>
                        <p><strong>Property Type:</strong> {selectedProperty.property_type}</p>
                        <p><strong>Size:</strong> {selectedProperty.size} sq ft</p>
                        <p><strong>Year Built:</strong> {selectedProperty.year_built}</p>
                        <p><strong>Description:</strong> {selectedProperty.description}</p>
                        <p><strong>Country:</strong> {selectedProperty.country}</p>
                      </div>
                    )}
                    <DialogFooter>
                      <Button onClick={handleClose}>Close</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            ))
          ) : (
            <p>No other properties available.</p>
          )}
        </div>
      </div>
    </section>
  );
};
