import { useState } from 'react';
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertCircle, MapPin, Globe, Compass } from "lucide-react";

export const ChoosePropertyLocation: React.FC<{
    propertyLocation: { postcode: string; country: string; adminDistrict: string } | null;
    setPropertyLocation: React.Dispatch<React.SetStateAction<{ postcode: string; country: string; adminDistrict: string } | null>>;
}> = ({ setPropertyLocation }) => {
    const [postcode, setPostcode] = useState("");
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handlePostcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPostcode(e.target.value);
    };

    const validatePostcode = async () => {
        try {
            const response = await axios.get(`https://api.postcodes.io/postcodes/${postcode}/validate`);
            return response.data.result;
        } catch (err) {
            setError("Error validating postcode. Please try again.");
            return false;
        }
    };

    const fetchPostcodeData = async () => {
        setLoading(true);
        setError("");
        setData(null);

        const isValid = await validatePostcode();

        if (!isValid) {
            setError("Invalid postcode. Please enter a valid postcode.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(`https://api.postcodes.io/postcodes/${postcode}`);
            setData(response.data.result);

            // Set the property location in the parent component
            setPropertyLocation({
                postcode: response.data.result.postcode,
                country: response.data.result.country,
                adminDistrict: response.data.result.admin_district,
            });
        } catch (err) {
            setError("Error fetching data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Enter your Postcode</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4">
                        <Input
                            placeholder="Enter postcode (e.g., SE1 4GD)"
                            value={postcode}
                            onChange={handlePostcodeChange}
                            className="max-w-xs"
                        />
                        <Button onClick={fetchPostcodeData} disabled={loading || !postcode}>
                            {loading ? "Loading..." : "Search"}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {error && (
                <div className="flex items-center mt-4 text-red-500">
                    <AlertCircle className="mr-2" />
                    <p>{error}</p>
                </div>
            )}

            {data && (
                <Card className="mt-6 p-4 shadow-lg border">
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
                        <div className="flex items-center">
                            <MapPin className="mr-2 " />
                            <p><strong>District:</strong> {data.admin_district}</p>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
};
