// src/components/PropertyFilters.tsx
import React, { useState } from 'react';
import { ChevronsUpDown, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';


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
  const [locationOpen, setLocationOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedPropertyType, setSelectedPropertyType] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('');

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location === "All" ? "" : location);
    onFilterChange('location', location === "All" ? "" : location);
    setLocationOpen(false);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    onFilterChange('sort_by', value);
  };

  return (
    <form className='flex flex-wrap justify-between'> 
        {/* Left Filters */}
        <div className='flex flex-wrap gap-4 '>
        <div className='flex flex-row space-x-6 '>
            {/* Location Filter */}
            <div className='flex flex-col space-y-1.5'>
            <label htmlFor="location" className='text-sm font-semibold hidden'>Location:</label>
            <Popover open={locationOpen} onOpenChange={setLocationOpen}>
                <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={locationOpen}
                    className="w-full justify-between"
                >
                    {selectedLocation || "Select location"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
                </PopoverTrigger>
                <PopoverContent
                side="bottom"
                align="start"
                className="w-full p-0"
                >
                <Command>
                    <CommandInput placeholder="Search location..." />
                    <CommandList className="h-48">
                    <CommandItem
                        key="all"
                        value="All"
                        onSelect={() => handleLocationSelect("All")}
                    >
                        <Check
                        className={`mr-2 h-4 w-4 ${!selectedLocation ? "opacity-100" : "opacity-0"}`}
                        />
                        All Locations
                    </CommandItem>
                    {locations.map((location) => (
                        <CommandItem
                        key={location}
                        value={location}
                        onSelect={() => handleLocationSelect(location)}
                        >
                        <Check
                            className={`mr-2 h-4 w-4 ${selectedLocation === location ? "opacity-100" : "opacity-0"}`}
                        />
                        {location}
                        </CommandItem>
                    ))}
                    </CommandList>
                </Command>
                </PopoverContent>
            </Popover>
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
                    {sortBy || "Select sorting option"}
                </SelectValue>
                </SelectTrigger>
                <SelectContent className="left-0 origin-top-right">
                    <SelectItem value="price_asc">Price: Low to High</SelectItem>
                    <SelectItem value="price_desc">Price: High to Low</SelectItem>
                    <SelectItem value="annual_return_asc">Ann. Return: Low to High</SelectItem>
                    <SelectItem value="annual_return_desc">Ann. Return: High to Low</SelectItem>
                    <SelectItem value="funding_asc">Funding: Low to High</SelectItem>
                    <SelectItem value="funding_desc">Funding: High to Low</SelectItem>
                </SelectContent>
            </Select>
        </div>
    </form>
  );
};
