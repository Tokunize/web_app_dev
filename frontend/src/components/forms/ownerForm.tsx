import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import axios from "axios";
import { useToast } from "../ui/use-toast";

type FormData = {
  title: string;
  bedrooms: number;
  bathrooms: number;
  price: number;
  location: string;
  property_type: string;
  size: number;
  year_built: number;
  description: string;
  amenities: string[];
  country: string;
};

interface OwnerPropertyFormProps {
  onPropertyCreated: (newProperty: FormData) => void;
}

const OwnerPropertyForm: React.FC<OwnerPropertyFormProps> = ({
  onPropertyCreated,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const [amenities, setAmenities] = useState<string[]>([]);
  const [newAmenity, setNewAmenity] = useState('');
  const { toast } = useToast();

  const handleAddAmenity = () => {
    if (newAmenity.trim() === '') return;
    setAmenities([...amenities, newAmenity]);
    setNewAmenity('');
  };

  const handleRemoveAmenity = (index: number) => {
    setAmenities(amenities.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormData) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("Access token not found");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      };

      const finalData = { ...data, amenities, status: "under_review" };

      const response = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}property/create/`,
        finalData,
        config
      );

      toast({
        title: "Property submitted!",
        description: "Your property has been successfully submitted.",
        variant: "default",
      });

      onPropertyCreated(response.data.property);
      reset();
      setAmenities([]);
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "There was an error submitting your property.",
        variant: "destructive",
      });

      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-[90%] mx-auto p-6 bg-white shadow-md rounded-md space-y-6"
    >
      <h2 className="text-2xl font-bold mb-4">Property Form</h2>

      <div className="flex gap-4">
        <div className="w-1/3">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <Input
            id="title"
            {...register("title", { required: "Title is required" })}
            className="w-full mt-1"
            placeholder="Enter property title"
          />
          {errors.title && (
            <span className="text-red-500 text-sm">{errors.title.message}</span>
          )}
        </div>
        <div className="w-1/3">
          <label
            htmlFor="bedrooms"
            className="block text-sm font-medium text-gray-700"
          >
            Bedrooms
          </label>
          <Input
            id="bedrooms"
            type="number"
            {...register("bedrooms", { required: "Bedrooms are required", min: 1 })}
            className="w-full mt-1"
            placeholder="Enter number of bedrooms"
          />
          {errors.bedrooms && (
            <span className="text-red-500 text-sm">{errors.bedrooms.message}</span>
          )}
        </div>
        <div className="w-1/3">
          <label
            htmlFor="bathrooms"
            className="block text-sm font-medium text-gray-700"
          >
            Bathrooms
          </label>
          <Input
            id="bathrooms"
            type="number"
            {...register("bathrooms", { required: "Bathrooms are required", min: 1 })}
            className="w-full mt-1"
            placeholder="Enter number of bathrooms"
          />
          {errors.bathrooms && (
            <span className="text-red-500 text-sm">{errors.bathrooms.message}</span>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <div className="w-1/3">
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Price
          </label>
          <Input
            id="price"
            type="number"
            {...register("price", { required: "Price is required" })}
            className="w-full mt-1"
            placeholder="Enter property price"
          />
          {errors.price && (
            <span className="text-red-500 text-sm">{errors.price.message}</span>
          )}
        </div>

        <div className="w-1/3">
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Location
          </label>
          <Input
            id="location"
            {...register("location", { required: "Location is required" })}
            className="w-full mt-1"
            placeholder="Enter property location"
          />
          {errors.location && (
            <span className="text-red-500 text-sm">{errors.location.message}</span>
          )}
        </div>

        <div className="w-1/3">
          <label
            htmlFor="property_type"
            className="block text-sm font-medium text-gray-700"
          >
            Property Type
          </label>
          <Input
            id="property_type"
            {...register("property_type", { required: "Property type is required" })}
            className="w-full mt-1"
            placeholder="Enter property type"
          />
          {errors.property_type && (
            <span className="text-red-500 text-sm">
              {errors.property_type.message}
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <div className="w-1/3">
          <label
            htmlFor="size"
            className="block text-sm font-medium text-gray-700"
          >
            Size (sq ft)
          </label>
          <Input
            id="size"
            type="number"
            {...register("size", { required: "Size is required" })}
            className="w-full mt-1"
            placeholder="Enter property size"
          />
          {errors.size && (
            <span className="text-red-500 text-sm">{errors.size.message}</span>
          )}
        </div>

        <div className="w-1/3">
          <label
            htmlFor="year_built"
            className="block text-sm font-medium text-gray-700"
          >
            Year Built
          </label>
          <Input
            id="year_built"
            type="number"
            {...register("year_built", { required: "Year built is required" })}
            className="w-full mt-1"
            placeholder="Enter year built"
          />
          {errors.year_built && (
            <span className="text-red-500 text-sm">
              {errors.year_built.message}
            </span>
          )}
        </div>

        <div className="w-1/3">
          <label
            htmlFor="country"
            className="block text-sm font-medium text-gray-700"
          >
            Country
          </label>
          <select
            id="country"
            {...register("country", { required: "Country is required" })}
            className="w-full mt-1 border-gray-300 rounded-md"
          >
            <option value="">Select country</option>
            <option value="USA">USA</option>
            <option value="Canada">Canada</option>
            <option value="Mexico">Mexico</option>
          </select>
          {errors.country && (
            <span className="text-red-500 text-sm">{errors.country.message}</span>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <Textarea
          id="description"
          {...register("description", { required: "Description is required" })}
          className="w-full mt-1"
          placeholder="Enter property description"
        />
        {errors.description && (
          <span className="text-red-500 text-sm">
            {errors.description.message}
          </span>
        )}
      </div>

      <div>
        <label
          htmlFor="amenities"
          className="block text-sm font-medium text-gray-700"
        >
          Amenities
        </label>
        <div className="mb-4">
          <Input
            type="text"
            value={newAmenity}
            onChange={(e) => setNewAmenity(e.target.value)}
            className="w-full mt-1"
            placeholder="Enter new amenity"
          />
          <Button type="button" onClick={handleAddAmenity} className="mt-2">
            Add Amenity
          </Button>
        </div>
        {amenities.map((amenity, index) => (
          <div key={index} className="flex items-center gap-4 mb-2">
            <span className="flex-1">{amenity}</span>
            <Button
              type="button"
              onClick={() => handleRemoveAmenity(index)}
              className="ml-2"
            >
              Remove
            </Button>
          </div>
        ))}
      </div>

      <Button
        type="submit"
        className="w-full py-2 px-4 rounded-md "
      >
        Submit
      </Button>
    </form>
  );
};

export default OwnerPropertyForm;

