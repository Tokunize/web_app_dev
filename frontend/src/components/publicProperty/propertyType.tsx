import React, { useState } from "react";
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
import { Control, FieldErrors, Controller } from "react-hook-form";
import { formValuesPublicProperty } from "@/private/owner/publicPropertySchema";

// Define available property types
const propertyTypes = [
    { value: "Office", label: "Office" },
    { value: "Multifamily", label: "Multifamily" },
    { value: "Offices", label: "Offices" },
    { value: "Mixed Use", label: "Mixed Use" },
    { value: "Hospitality", label: "Hospitality" },
    { value: "Land", label: "Land" },
    { value: "Data Centre", label: "Data Centre" },
    { value: "Industrial", label: "Industrial" },
    { value: "Warehouse", label: "Warehouse" },
    { value: "Student Housing", label: "Student Housing" },
];

interface PropertyTypeProps {
    control: Control<formValuesPublicProperty>;
    errors: FieldErrors<formValuesPublicProperty>;
}

export const ChoosePropertyType: React.FC<PropertyTypeProps> = ({ control, errors }) => {
    const [open, setOpen] = useState(false); // Estado para controlar la visibilidad del popover

    return (
        <div className="w-full">
            <h3 className="font-bold text-3xl mb-4 text-center mb-[40px]">
                Which of these best describes your place?
            </h3>
            <Controller
                control={control}
                name="propertyType"
                render={({ field }) => (
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open ? "true" : "false"}
                                className="flex w-full justify-center mx-auto"
                            >
                                {field.value
                                    ? propertyTypes.find((type) => type.value === field.value)?.label
                                    : "Select Property Type..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="mt-3 p-0">
                            <Command>
                                <CommandInput placeholder="Search property type..." />
                                <CommandList>
                                    <CommandEmpty>No property type found.</CommandEmpty>
                                    <CommandGroup>
                                        {propertyTypes.map((type) => (
                                            <CommandItem
                                                key={type.value}
                                                value={type.value}
                                                onSelect={(value) => {
                                                    field.onChange(value); // Actualiza el valor en react-hook-form
                                                    setOpen(false); // Cierra el popover después de seleccionar un valor
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        field.value === type.value ? "opacity-100" : "opacity-0"
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
                )}
            />
            {errors.propertyType && <p className="text-red-500 text-sm">{errors.propertyType.message}</p>}
        </div>
    );
};
