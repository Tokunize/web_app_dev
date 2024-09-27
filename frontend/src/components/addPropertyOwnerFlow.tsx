import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown } from "lucide-react"

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
  } from "@/components/ui/command"
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"

// Step 1: Property Details
const propertyTypes = [
    { value: "apartment", label: "Apartment" },
    { value: "house", label: "House" },
    { value: "condo", label: "Condo" },
    { value: "townhouse", label: "Townhouse" },
    { value: "villa", label: "Villa" },
    { value: "land", label: "Land" },
    { value: "commercial", label: "Commercial" },
    { value: "industrial", label: "Industrial" },
  ]
  
  export const Step1 = () => {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")
  
    return (
      <div className="">
        <h3 className="font-bold text-2xl text-center">Which of these best describes your place?</h3>        
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="flex w-[330px] sm:w-[100%] justify-center mx-auto "
            >
              {value
                ? propertyTypes.find((type) => type.value === value)?.label
                : "Select Property Type..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="mt-3 p-0"> {/* Añadido w-full aquí */}
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
                        setValue(currentValue === value ? "" : currentValue)
                        setOpen(false)
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === type.value ? "opacity-100" : "opacity-0"
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
    )
  }
  
// Step 2: Property Location
const Step2 = () => (
  <div>
    <h2>Step 2: Property Location</h2>
    <p>Specify the location of the property.</p>
   
  </div>
);

// Step 3: Property Images
const Step3 = () => (
  <div>
    <h2>Step 3: Property Images</h2>
    <p>Upload images of the property.</p>
   
  </div>
);

// Step 4: Pricing Information
const Step4 = () => (
  <div>
    <h2>Step 4: Pricing Information</h2>
    <p>Set the pricing information for the property.</p>
   
  </div>
);

// Step 5: Owner Details
const Step5 = () => (
  <div>
    <h2>Step 5: Owner Details</h2>
    <p>Enter details about the property owner.</p>
   
  </div>
);

// Step 6: Review Information
const Step6 = () => (
  <div>
    <h2>Step 6: Review Information</h2>
    <p>Review all the entered information.</p>

  </div>
);

// Step 7: Confirmation
const Step7 = () => (
  <div>
    <h2>Step 7: Confirmation</h2>
    <p>Confirm the submission of your property.</p>
   
  </div>
);

// Step 8: Feedback
const Step8 = () => (
  <div>
    <h2>Step 8: Feedback</h2>
    <p>Provide feedback about the process.</p>
   
  </div>
);

// Step 9: Completion
const Step9 = () => (
  <div>
    <h2>Step 9: Completion</h2>
    <p>Your property has been added successfully!</p>
  </div>
);

// Main AddPropertyFlow component
export const AddPropertyFlow = () => {
  const [step, setStep] = useState(1);

  const goNext = () => setStep((prev) => Math.min(prev + 1, 9)); // Move to next step, max is 9
  const goBack = () => setStep((prev) => Math.max(prev - 1, 1)); // Move to previous step, min is 1

  const renderStep = () => {
    switch (step) {
      case 1: return <Step1 />;
      case 2: return <Step2  />;
      case 3: return <Step3  />;
      case 4: return <Step4  />;
      case 5: return <Step5  />;
      case 6: return <Step6  />;
      case 7: return <Step7  />;
      case 8: return <Step8  />;
      case 9: return <Step9 />;
      default: return null;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">Sell new property</Button>
      </DialogTrigger>
      <DialogContent className="h-[80%]">
        <DialogHeader>
          <DialogTitle>Sell new property</DialogTitle>
          <DialogDescription>
            Please follow the steps to sell a new property.
          </DialogDescription>
        </DialogHeader>
    
        {renderStep()}
        <Progress className="rounded-xs h-2 bg-gray-200" value={(step / 9) * 100} /> {/* Progress bar */}
        <DialogFooter>
          {step > 1 && (
            <Button variant="outline" onClick={goBack}>
              Back
            </Button>
          )}
          {step < 9 && (
            <Button className="w-full" onClick={goNext}>
              {step === 8 ? "Finish" : "Next"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
