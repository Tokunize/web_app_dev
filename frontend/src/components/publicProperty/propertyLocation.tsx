import { useState } from 'react';
import axios from 'axios';
import { MapPin, Globe, Compass } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import InputForm from '../forms/inputForm';
import { Button } from '../ui/button';
import { formValuesPublicProperty } from "@/private/owner/publicPropertySchema";
import { Control, FieldErrors } from "react-hook-form";

interface PropertyDetailsProps {
    control: Control<formValuesPublicProperty>;
    errors: FieldErrors<formValuesPublicProperty>;
  }

export const ChoosePropertyLocation = ({ errors,control }:PropertyDetailsProps) => {
    const [postcode, setPostcode] = useState("");
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const {toast} = useToast()


    const validatePostcode = async () => {
        try {
            const response = await axios.get(`https://api.postcodes.io/postcodes/${postcode}/validate`);
            return response.data.result;
        } catch (err) {
            toast({
                title: "Error!",
                description: "Error validating postcode. Please try again.",
                variant: "destructive",
              });
            // setError("Error validating postcode. Please try again.");
            return false;
        }
    };

    const fetchPostcodeData = async () => {
        setLoading(true);

        const isValid = await validatePostcode();

        if (!isValid){
            toast({
            title: "Error!",
            description: "Error validating postcode. Please try again.",
            variant: "destructive",
          });
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(`https://api.postcodes.io/postcodes/${postcode}`);

        } catch (err) {
            toast({
                title: "Error!",
                description: "Error fetching data. Please try again.",
                variant: "destructive",
              });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className='flex items-center flex-row space-x-4 justify-center '>
                <InputForm name="propertyLocation" label="Type Property Postcode" control={control} type="text" error={errors.propertyLocation?.message}/>  
                <Button onClick={fetchPostcodeData} >Search</Button> 
            </div>
           
            {data && (
                <div className="mt-6 p-4 shadow-lg border">
                    <h2 className="text-xl font-bold mb-4">Postcode Information</h2>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center">
                            <MapPin className="mr-2 " />
                            <p><strong>Postcode:</strong> {data.postcode}</p>
                        </div>
                        <div className="flex items-center">
                            <Globe className="mr-2" />
                            <p><strong>Country:</strong> {data.country}</p>
                        </div>
                        <div className="flex items-center">
                            <Compass className="mr-2" />
                            <p><strong>Region:</strong> {data.region}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
