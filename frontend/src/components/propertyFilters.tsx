import React, { useState } from 'react';
import { ChevronsUpDown, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

// Mapeo de opciones legibles para clasificación
const sortOptions: { [key: string]: string } = {
  'price_asc': 'Price: Low to High',
  'price_desc': 'Price: High to Low',
  'annual_return_asc': 'Annual Return: Low to High',
  'annual_return_desc': 'Annual Return: High to Low',
  //   'funding_asc': 'Funding: Low to High',
  //   'funding_desc': 'Funding: High to Low',
};

interface FiltersProps {
  locations: string[];
  onFilterChange: (key: string, value: any) => void;
  propertyTypes: string[];
}

export const PropertyFilters: React.FC<FiltersProps> = ({
  locations,
  onFilterChange,
  propertyTypes,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedPropertyType, setSelectedPropertyType] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('');

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location === "All" ? "" : location);
    onFilterChange('location', location === "All" ? "" : location);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    onFilterChange('sort_by', value);
  };

  return (
    <form className='flex flex-wrap justify-between'> 
      {/* Left Filters */}
      <div className='flex flex-wrap gap-4'>
        <div className='flex flex-row space-x-6 '>
          {/* Location Filter */}
          <div className='flex flex-col space-y-1.5'>
            <label htmlFor="location" className='text-sm font-semibold hidden'>Location:</label>
            <Select onValueChange={handleLocationSelect}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder='Select Location'>
                  {selectedLocation || "Select location"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="all" value="All">
                  All Locations
                </SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Property Type Filter */}
          <div className='flex flex-col space-y-1.5'>
            <label htmlFor="propertyType" className='text-sm font-semibold hidden'>Property Type:</label>
            <Select
              onValueChange={(value) => {
                setSelectedPropertyType(value === "all" ? "" : value);
                onFilterChange('property_type', value === "all" ? "" : value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder='Select Property Type'>
                  {selectedPropertyType || "Select property type"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="all" value="all">All Types</SelectItem>
                {propertyTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Right Filter */}
      <div className='flex flex-col space-y-1.5'>
        <label htmlFor="sort_by" className='text-sm font-semibold hidden'>Sort By:</label>
        <Select onValueChange={handleSortChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder='Sort by'>
              {sortBy ? sortOptions[sortBy] : "Select sorting option"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="left-0 origin-top-right">
            {Object.entries(sortOptions).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </form>
  );
};
