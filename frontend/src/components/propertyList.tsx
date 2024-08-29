// src/components/PropertyList.tsx
import React, { useState } from 'react';
import { PropertyFilters } from './propertyFilters';
import { PropertyListCard } from './propertyListCard';

// Datos falsos para las propiedades
const fakeProperties = [
  {
    title: 'Not Luxury Beachfront Villa',
    location: 'Malibu, CA',
    minTokenPrice: '$1,000,000',
    estAnnualReturn: '8%',
    funding: 50,
    propertyImg: 'https://via.placeholder.com/500x300?text=Beachfront+Villa',
    linkTo: '/property-details/1',
  },
  {
    title: 'Luxury Beachfront Villa',
    location: 'Malibu, CA',
    minTokenPrice: '$2,000,000',
    estAnnualReturn: '6%',
    funding: 70,
    propertyImg: 'https://via.placeholder.com/500x300?text=Beachfront+Villa',
    linkTo: '/property-details/1',
  },
  {
    title: 'Modern Downtown Loft',
    location: 'New York, NY',
    minTokenPrice: '$750,000',
    estAnnualReturn: '6%',
    funding: 70,
    propertyImg: 'https://via.placeholder.com/500x300?text=Downtown+Loft',
    linkTo: '/property-details/2',
  },
  {
    title: 'Cozy Mountain Cabin',
    location: 'Aspen, CO',
    minTokenPrice: '$500,000',
    estAnnualReturn: '7%',
    funding: 30,
    propertyImg: 'https://via.placeholder.com/500x300?text=Mountain+Cabin',
    linkTo: '/property-details/3',
  },
  {
    title: 'Spacious Suburban Home',
    location: 'Chicago, IL',
    minTokenPrice: '$300,000',
    estAnnualReturn: '5%',
    funding: 90,
    propertyImg: 'https://via.placeholder.com/500x300?text=Suburban+Home',
    linkTo: '/property-details/4',
  },
  {
    title: 'Elegant City Apartment',
    location: 'San Francisco, CA',
    minTokenPrice: '$900,000',
    estAnnualReturn: '7%',
    funding: 60,
    propertyImg: 'https://via.placeholder.com/500x300?text=City+Apartment',
    linkTo: '/property-details/5',
  },
  {
    title: 'Charming Countryside House',
    location: 'Austin, TX',
    minTokenPrice: '$400,000',
    estAnnualReturn: '6%',
    funding: 40,
    propertyImg: 'https://via.placeholder.com/500x300?text=Countryside+House',
    linkTo: '/property-details/6',
  },
  {
    title: 'Stylish Studio Loft',
    location: 'Seattle, WA',
    minTokenPrice: '$350,000',
    estAnnualReturn: '5%',
    funding: 80,
    propertyImg: 'https://via.placeholder.com/500x300?text=Studio+Loft',
    linkTo: '/property-details/7',
  },
];

// Utiliza una función de clasificación para aplicar el ordenamiento basado en el parámetro
const sortProperties = (properties: any[], sortBy: string) => {
  return properties.sort((a, b) => {
    switch (sortBy) {
      case 'price_asc':
        return parseInt(a.minTokenPrice.replace(/[^\d]/g, '')) - parseInt(b.minTokenPrice.replace(/[^\d]/g, ''));
      case 'price_desc':
        return parseInt(b.minTokenPrice.replace(/[^\d]/g, '')) - parseInt(a.minTokenPrice.replace(/[^\d]/g, ''));
      case 'annual_return_asc':
        return parseFloat(a.estAnnualReturn) - parseFloat(b.estAnnualReturn);
      case 'annual_return_desc':
        return parseFloat(b.estAnnualReturn) - parseFloat(a.estAnnualReturn);
      case 'funding_asc':
        return a.funding - b.funding;
      case 'funding_desc':
        return b.funding - a.funding;
      default:
        return 0;
    }
  });
};

export const PropertyList: React.FC = () => {
  const [filters, setFilters] = useState({
    location: '',
    property_type: '',
    sort_by: ''
  });

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const filteredProperties = fakeProperties.filter(property => {
    const meetsLocation = !filters.location || property.location === filters.location;
    const meetsPropertyType = !filters.property_type || property.title.includes(filters.property_type);
    return meetsLocation && meetsPropertyType;
  });

  const sortedProperties = sortProperties(filteredProperties, filters.sort_by);

  return (
    <div className="py-10">
      <PropertyFilters
        locations={['Malibu, CA', 'New York, NY', 'Aspen, CO', 'Chicago, IL', 'San Francisco, CA', 'Austin, TX', 'Seattle, WA']}
        priceRange={['£100,000', '£200,000', '£300,000', '£400,000', '£500,000', '£750,000', '£1,000,000']}
        onFilterChange={handleFilterChange}
        propertyTypes={['House', 'Apartment', 'Loft', 'Studio', 'Cabin']}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sortedProperties.map((property, index) => (
          <PropertyListCard
            key={index}
            title={property.title}
            location={property.location}
            minTokenPrice={property.minTokenPrice}
            estAnnualReturn={property.estAnnualReturn}
            propertyImg={property.propertyImg}
            linkTo={property.linkTo}
          />
        ))}
      </div>
    </div>
  );
};
