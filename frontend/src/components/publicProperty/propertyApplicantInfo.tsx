import InputForm from "@/components/forms/inputForm";
import { formValuesPublicProperty } from "@/private/owner/publicPropertySchema";
import {  Control, FieldErrors } from "react-hook-form";

// Asegúrate de recibir control y errores como props
interface PropertyApplicantInfoProps {
    control: Control<formValuesPublicProperty>;
    errors: FieldErrors<formValuesPublicProperty>;
}

export const PropertyApplicantInfo = ({ control, errors }: PropertyApplicantInfoProps) => {
    return (
        <>
            <h3 className="font-bold text-3xl mb-4">Perfonal Information</h3>
            <div className="grid grid-cols-2 gap-6">
                <InputForm name="applicantName" label="Applicant Name" control={control} type="text" error={errors.applicantName?.message} />
                <InputForm name="address" label="Address" control={control} type="text" error={errors.address?.message} />
                <InputForm name="nationalInsurance" label="National Insurance" control={control} type="text" error={errors.nationalInsurance?.message} />
                <InputForm name="emailAddress" label="Email Address" control={control} type="email" error={errors.emailAddress?.message} />
            <InputForm name="phoneNumber" label="Phone Number" control={control} type="text" error={errors.phoneNumber?.message} />
            </div>

        </>
    );
};
