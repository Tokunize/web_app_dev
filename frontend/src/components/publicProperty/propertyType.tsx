import React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

// Define available property types
const propertyTypes = [
    { value: "Apartment", label: "Apartment" },
    { value: "Multifamily", label: "Multifamily" },
    { value: "Offices", label: "Offices" },
    { value: "Townhouse", label: "Townhouse" },
    { value: "Villa", label: "Villa" },
    { value: "Land", label: "Land" },
    { value: "Commercial", label: "Commercial" },
    { value: "Industrial", label: "Industrial" },
];

// Component definition with props for propertyType and setPropertyType
export const ChoosePropertyType: React.FC<{
    propertyType: string;
    setPropertyType: React.Dispatch<React.SetStateAction<string>>;
}> = ({ propertyType, setPropertyType }) => {
    const [open, setOpen] = React.useState(false);

    return (
        <div>
            <h3 className="font-bold text-2xl text-center mb-[40px]">
                Which of these best describes your place?
            </h3>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="flex w-[100%] justify-center mx-auto"
                    >
                        {propertyType
                            ? propertyTypes.find((type) => type.value === propertyType)?.label
                            : "Select Property Type..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="mt-3 p-0 w-[100%]">
                    <Command>
                        <CommandInput placeholder="Search property type..." />
                        <CommandList>
                            <CommandEmpty>No property type found.</CommandEmpty>
                            <CommandGroup>
                                {propertyTypes.map((type) => (
                                    <CommandItem
                                        key={type.value}
                                        value={type.value}
                                        onSelect={(currentValue) => {
                                            // Update the property type in the parent component
                                            setPropertyType(currentValue === propertyType ? "" : currentValue);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                propertyType === type.value ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {type.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
};
