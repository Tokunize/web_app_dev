import { Control, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { formValuesPublicProperty } from "@/private/owner/publicPropertySchema";

interface Props {
    name: keyof formValuesPublicProperty;
    control: Control<any>;
    label: string;
    type?: string;
    error?: string;
}

export const InputForm = ({ name, control, label, error, type = "text" }: Props) => {
    return (
        <div className="relative z-0 w-full  group">
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <>
                        <Input
                            id={name}
                            type={type}
                            {...field}
                            value={field.value || ""} // Esto asegura que el campo se vacíe con reset()
                            className={`block py-2.5 px-3 pr-6 w-full text-sm bg-transparent focus:outline-none peer mt-1 ${error ? "border-red-500" : ""}`}
                            placeholder=" " // Para que el placeholder no se vea
                        />
                        <label
                            htmlFor={name}
                            className="pl-3 peer-focus:font-medium absolute top-3 text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-8 scale-75 top-2 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[black] peer-focus:dark:text-[#C8E870] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8"
                        >
                            {label}
                        </label>
                    </>
                )}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};

export default InputForm;
