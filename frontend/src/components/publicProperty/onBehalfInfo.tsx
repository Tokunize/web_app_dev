import { Control, FieldErrors, Controller } from "react-hook-form";
import { formValuesPublicProperty } from "@/private/owner/publicPropertySchema";
import InputForm from "../forms/inputForm";

interface OnBehalfInfoProps {
  control: Control<formValuesPublicProperty>;
  errors: FieldErrors<formValuesPublicProperty>;
}

export const OnBehalfInfo = ({ control, errors }: OnBehalfInfoProps) => {
  return (
    <>
    <h4 className="font-bold text-3xl mb-4">On behalf of a company, developer, or institution </h4>
    <div className="grid grid-cols-2 gap-5">
      {/* Organization Name */}
      <InputForm
        name="organizationName"
        label="Organization Name"
        control={control}
        type="text"
        error={errors.organizationName?.message}
      />

      {/* Position/Role */}
      <InputForm
        name="position"
        label="Position/Role"
        control={control}
        type="text"
        error={errors.position?.message}
      />

      {/* Type of Organisation */}
      <InputForm
        name="organisationType"
        label="Type of Organisation (e.g., LLC, Corporation...)"
        control={control}
        type="text"
        error={errors.organisationType?.message}
      />

      {/* Business Registration Number */}
      <InputForm
        name="registrationNumber"
        label="Business Registration Number"
        control={control}
        type="text"
        error={errors.registrationNumber?.message}
      />

      {/* Unique Tax Reference (UTR) */}
      <InputForm
        name="uniqueTaxReference"
        label="Unique Tax Reference (UTR)"
        control={control}
        type="text"
        error={errors.uniqueTaxReference?.message}
      />

      {/* Relationship Explanation */}
      <InputForm
        name="relationshipExplanation"
        label="Please explain your relationship with this asset"
        control={control}
        type="text"
        error={errors.relationshipExplanation?.message}
      />

      {/* Broker-dealer Question */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700">Are you a broker-dealer?</label>
        <Controller
          name="isBroker"
          control={control}
          render={({ field }) => (
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="Yes"
                  checked={field.value === "Yes"}
                  onChange={() => field.onChange("Yes")}
                  className="form-radio"
                />
                <span>Yes</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="No"
                  checked={field.value === "No"}
                  onChange={() => field.onChange("No")}
                  className="form-radio"
                />
                <span>No</span>
              </label>
            </div>
          )}
        />
        {errors.isBroker && <p className="text-red-500 text-sm mt-1">{errors.isBroker.message}</p>}
      </div>
    </div>
    </>
  );
};

export default OnBehalfInfo;



