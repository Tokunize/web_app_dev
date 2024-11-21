import React from "react";
import { Button } from "@/components/ui/button";
import InputForm from "../forms/inputForm";
import { formValuesPublicProperty } from "@/components/forms/schemas/publicPropertySchema";
import { Control, FieldErrors, Controller } from "react-hook-form";
import { ChoosePropertyLocation } from "./propertyLocation";

interface PropertyDetailsProps {
  control: Control<formValuesPublicProperty>;
  errors: FieldErrors<formValuesPublicProperty>;
}

export const PropertyDetails: React.FC<PropertyDetailsProps> = ({ errors, control }) => {
  return (
    <div>
      <h2 className="font-bold text-4xl mb-[60px]">Details about your property</h2>

      <div className="grid grid-cols-2 gap-5">
      <InputForm
        name="propertyTitle"
        label="Property Title"
        control={control}
        type="text"
        error={errors.propertyTitle?.message}
      />

        <InputForm
            name="yearBuilt"
            label="Year Built"
            control={control}
            type="text"
            error={errors.yearBuilt?.message}
        />

      {/* Bedroom Count */}
      <div className="flex  items-center border-b pb-4 justify-between">
        <label className="text-lg">Bedrooms</label>
        <Controller
          name="bedroomCount"
          control={control}
          render={({ field }) => (
            <div className="flex items-center space-x-2">
              <Button   type="button"  variant="outline" onClick={() => field.onChange(Math.max((field.value || 0) - 1, 0))}>
                -
              </Button>
              <span className="text-xl">{field.value || 0}</span>
              <Button  type="button"  variant="outline" onClick={() => field.onChange((field.value || 0) + 1)}>
                +
              </Button>
            </div>
          )}
        />
      </div>

      {/* Bathroom Count */}
      <div className="flex items-center border-b pb-4 justify-between">
        <label className="text-lg">Bathrooms</label>
        <Controller
          name="bathroomCount"
          control={control}
          render={({ field }) => (
            <div className="flex items-center space-x-2">
              <Button type="button" variant="outline" onClick={() => field.onChange(Math.max((field.value || 0) - 1, 0))}>
                -
              </Button>
              <span className="text-xl">{field.value || 0}</span>
              <Button   type="button"  variant="outline" onClick={() => field.onChange((field.value || 0) + 1)}>
                +
              </Button>
            </div>
          )}
        />
      </div>

      {/* Size */}
      <InputForm
        name="propertySize"
        label="Property Size"
        control={control}
        type="text"
        error={errors.propertySize?.message}
      />
      </div>
      <ChoosePropertyLocation control={control} errors={errors} />
    </div>
  );
};

export default PropertyDetails;
