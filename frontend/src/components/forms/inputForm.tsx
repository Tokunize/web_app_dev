import { Control, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {FormDescription,} from "@/components/ui/form";

interface Props {
    name: string;
    control: Control<any>;
    label: string;
    type?: string;
    description?: string;
    error?: string;
}

const InputForm = ({ name, control, label, error, description ,type = "text" }: Props) => {
    return (
        <div className="relative z-0 w-full group">
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <>
                        <Input
                            id={name}
                            type={type}
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => field.onChange(type === "number" ? Number(e.target.value) : e.target.value)}  // Convert to number if type is "number"
                            className={`block py-2.5 px-3 pr-6 w-full text-sm bg-transparent focus:outline-none peer mt-1 ${error ? "border-red-500" : ""}`}
                            placeholder=" " // To hide the placeholder
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
            {description && <FormDescription className="mt-3">{description}</FormDescription>} {/* Descripción opcional */}
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};

export default InputForm
