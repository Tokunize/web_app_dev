import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useFetchPropertyDetails from '@/components/property/getDetailsHook';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImageUploader } from '@/components/property/imageUploader';
import ImageGallery from '@/components/property/imageGallery';

export const DashboardProperty = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const numericPropertyId = propertyId ? parseInt(propertyId, 10) : 0;
  const viewType = 'all';
  const { data, loading, error } = useFetchPropertyDetails(numericPropertyId, viewType);

  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    details: "",
    bedrooms: 0,
    bathrooms: 0,
    projected_annual_yield: undefined,
    price: 0,
    location: "",
    country: "",
    property_type: "",
    size: 0,
    year_built: new Date().getFullYear(),
    image: [],
    video_urls: "",
    amenities: [],
    active: false,
    total_investment_value: 0,
    underlying_asset_price: 0,
    closing_costs: 0,
    upfront_fees: 0,
    operating_reserve: 0,
    projected_rental_yield: 0,
    annual_gross_rents: 0,
    property_taxes: 0,
    homeowners_insurance: 0,
    property_management: 0,
    dao_administration_fees: 0,
    annual_cash_flow: 0,
    monthly_cash_flow: 0,
    projected_annual_cash_flow: 0,
    legal_documents_url: "",
    status: 'draft',  // Default status

  });

  useEffect(() => {
    if (data) {
      setFormValues(data);
    }
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(formValues); 
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('Access token not found');
        return;
      }
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      };

      const response = await axios.put('http://127.0.0.1:8000/property/create/', formValues, config);
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleImagesUploaded = (urls: string[]) => {
    setFormValues(prev => ({
      ...prev,
      image: urls,
    }));
  };

  const handleImageRemoved = (publicId: string) => {
    setFormValues(prev => ({
      ...prev,
      image: prev.image.filter(url => !url.includes(publicId)),
    }));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;


  return (
    <section>
      <form onSubmit={handleSubmit} className="w-[70%] mx-auto">
        <h2 className="font-bold">Property Information</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
          <label>
            <span className="block mb-1">Active</span>
            <Checkbox
              name="active"
              checked={formValues.active}
              onChange={handleChange}
            />
          </label>
          <label>
            <span className="block mb-1">Year Built</span>
            <Input
              type="number"
              name="year_built"
              value={formValues.year_built}
              onChange={handleChange}
            />
          </label>
          <label>
            <span className="block mb-1">Title</span>
            <Input
              type="text"
              name="title"
              value={formValues.title}
              onChange={handleChange}
            />
          </label>
          <label>
            <span className="block mb-1">Location</span>
            <Input
              type="text"
              name="location"
              value={formValues.location}
              onChange={handleChange}
            />
          </label>
          <label>
            <span className="block mb-1">Country</span>
            <Input
              type="text"
              name="country"
              value={formValues.country}
              onChange={handleChange}
            />
          </label>
          <label>
            <span className="block mb-1">Property Type</span>
            <Input
              type="text"
              name="property_type"
              value={formValues.property_type}
              onChange={handleChange}
            />
          </label>
          <label>
            <span className="block mb-1">Number of Bedrooms</span>
            <Input
              type="number"
              name="bedrooms"
              value={formValues.bedrooms}
              onChange={handleChange}
            />
          </label>
          <label>
            <span className="block mb-1">Number of Bathrooms</span>
            <Input
              type="number"
              name="bathrooms"
              value={formValues.bathrooms}
              onChange={handleChange}
            />
          </label>
          <label>
            <span className="block mb-1">Size (sq ft)</span>
            <Input
              type="number"
              name="size"
              value={formValues.size}
              onChange={handleChange}
            />
          </label>
        </div>
        
        <h2 className="text-left font-bold">Image Uploader</h2>
        <ImageUploader
          onImagesUploaded={handleImagesUploaded}
          onImageRemoved={handleImageRemoved}
        />
        <h2 className="text-left font-bold mb-5">Property Images</h2>
        <ImageGallery images={formValues.image || []} />
        
        <label>
          <span className="block mb-1">Video URLs (comma-separated)</span>
          <Textarea
            name="video_urls"
            value={formValues.video_urls}
            onChange={handleChange}
          />
        </label>
        
        <label>
          <span className="block mb-1">Details</span>
          <Textarea
            name="details"
            value={formValues.details}
            onChange={handleChange}
          />
        </label>
        <label className="font-bold">Amenities</label>
        <ul>
          {formValues.amenities.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <label>
            <span className="block mb-1 font-bold">Status</span>
            <select
              name="status"
              value={formValues.status}
              onChange={handleChange}
              className="form-select"
            >
              <option value="listing">Listing</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="coming_soon">Coming Soon</option>
              <option value="rejected">Rejected</option>
            </select>
          </label>

        <h2 className="font-bold">Financial Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
          <label>
            <span className="block mb-1">Projected Annual Yield</span>
            <Input
              type="number"
              name="projected_annual_yield"
              value={formValues.projected_annual_yield || ''}
              onChange={handleChange}
            />
          </label>
          <label>
            <span className="block mb-1">Total Investment Value</span>
            <Input
              type="number"
              name="total_investment_value"
              value={formValues.total_investment_value || ''}
              onChange={handleChange}
            />
          </label>
          <label>
            <span className="block mb-1">Underlying Asset Price</span>
            <Input
              type="number"
              name="underlying_asset_price"
              value={formValues.underlying_asset_price || ''}
              onChange={handleChange}
            />
          </label>
          <label>
            <span className="block mb-1">Closing Costs</span>
            <Input
              type="number"
              name="closing_costs"
              value={formValues.closing_costs || ''}
              onChange={handleChange}
            />
          </label>
          <label>
            <span className="block mb-1">Upfront Fees</span>
            <Input
              type="number"
              name="upfront_fees"
              value={formValues.upfront_fees || ''}
              onChange={handleChange}
            />
          </label>
          <label>
            <span className="block mb-1">Operating Reserve</span>
            <Input
              type="number"
              name="operating_reserve"
              value={formValues.operating_reserve || ''}
              onChange={handleChange}
            />
          </label>
          <label>
            <span className="block mb-1">Projected Rental Yield</span>
            <Input
              type="number"
              name="projected_rental_yield"
              value={formValues.projected_rental_yield || ''}
              onChange={handleChange}
            />
          </label>
          <label>
            <span className="block mb-1">Annual Gross Rents</span>
            <Input
              type="number"
              name="annual_gross_rents"
              value={formValues.annual_gross_rents || ''}
              onChange={handleChange}
            />
          </label>
          <label>
            <span className="block mb-1">Property Taxes</span>
            <Input
              type="number"
              name="property_taxes"
              value={formValues.property_taxes || ''}
              onChange={handleChange}
            />
          </label>
          <label>
            <span className="block mb-1">Homeowners Insurance</span>
            <Input
              type="number"
              name="homeowners_insurance"
              value={formValues.homeowners_insurance || ''}
              onChange={handleChange}
            />
          </label>
          <label>
            <span className="block mb-1">Property Management</span>
            <Input
              type="number"
              name="property_management"
              value={formValues.property_management || ''}
              onChange={handleChange}
            />
          </label>
          <label>
            <span className="block mb-1">DAO Administration Fees</span>
            <Input
              type="number"
              name="dao_administration_fees"
              value={formValues.dao_administration_fees || ''}
              onChange={handleChange}
            />
          </label>
          <label>
            <span className="block mb-1">Annual Cash Flow</span>
            <Input
              type="number"
              name="annual_cash_flow"
              value={formValues.annual_cash_flow || ''}
              onChange={handleChange}
            />
          </label>
          <label>
            <span className="block mb-1">Monthly Cash Flow</span>
            <Input
              type="number"
              name="monthly_cash_flow"
              value={formValues.monthly_cash_flow || ''}
              onChange={handleChange}
            />
          </label>
          <label>
            <span className="block mb-1">Projected Annual Cash Flow</span>
            <Input
              type="number"
              name="projected_annual_cash_flow"
              value={formValues.projected_annual_cash_flow || ''}
              onChange={handleChange}
            />
          </label>
        </div>  
        <label>
          <span className="block mb-1">Legal Documents URL</span>
          <Input
            type="text"
            name="legal_documents_url"
            value={formValues.legal_documents_url}
            onChange={handleChange}
          />
        </label>
        
        <Button type="submit">Submit</Button>
      </form>
    </section>
  );
};
