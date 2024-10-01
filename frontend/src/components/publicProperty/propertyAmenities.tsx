import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PropertyAmenitiesProps {
    amenities: string[]; // Array of available amenities
    setAmenities: React.Dispatch<React.SetStateAction<string[]>>; // Function to set selected amenities
    selectedAmenities: string[]; // Array of currently selected amenities
    setSelectedAmenities: React.Dispatch<React.SetStateAction<string[]>>; // Function to set selected amenities in the parent component
}

export const PropertyAmenities: React.FC<PropertyAmenitiesProps> = ({
    amenities,
    setAmenities,
    selectedAmenities,
    setSelectedAmenities,
}) => {
    const [newAmenity, setNewAmenity] = useState("");

    const handleAddAmenity = () => {
        if (newAmenity.trim() && !amenities.includes(newAmenity)) {
            setAmenities((prev) => [...prev, newAmenity]); // Update the parent component's amenities state
            setNewAmenity(""); // Clear input after adding
        }
    };

    const handleSelectAmenity = (amenity: string) => {
        if (selectedAmenities.includes(amenity)) {
            // If already selected, remove it from selected list
            setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
        } else {
            // Otherwise, add it to the selected list
            setSelectedAmenities([...selectedAmenities, amenity]);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Amenities</h2>
            
            {/* Display amenities in 3-column grid */}
            <div className="grid grid-cols-3 gap-4">
                {amenities.map((amenity, index) => (
                    <div
                        key={index}
                        onClick={() => handleSelectAmenity(amenity)}
                        className={`flex items-center justify-center p-4 rounded-md cursor-pointer ${
                            selectedAmenities.includes(amenity)
                                ? "bg-[#C8E870] border font-semibold"
                                : "bg-white border border-gray-300"
                        }`}
                    >
                        {amenity}
                    </div>
                ))}
            </div>

            {/* Add new amenity */}
            <div className="flex items-center space-x-2 mt-4">
                <Input
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    placeholder="New amenity"
                    className="max-w-xs"
                />
                <Button variant="outline" onClick={handleAddAmenity}>
                    + Add amenity
                </Button>
            </div>
        </div>
    );
};
