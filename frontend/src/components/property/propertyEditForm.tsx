import React, { useState, useEffect } from 'react';
import { getProperty, updateProperty, Property } from './propertyService';
import { useParams } from 'react-router-dom';

const PropertyEditForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Partial<Property>>({});

  useEffect(() => {
    loadProperty();
  }, []);

  const loadProperty = async () => {
    if (id) {
      const data = await getProperty(parseInt(id));
      setProperty(data);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProperty({ ...property, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      await updateProperty(parseInt(id), property as Property);
      alert('Property updated successfully');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Property</h2>
      <div>
        <label>Title</label>
        <input type="text" name="title" value={property.title || ''} onChange={handleChange} />
      </div>
      <div>
        <label>Bedrooms</label>
        <input type="number" name="bedrooms" value={property.bedrooms || 0} onChange={handleChange} />
      </div>
      <div>
        <label>Bathrooms</label>
        <input type="number" name="bathrooms" step="0.1" value={property.bathrooms || 0} onChange={handleChange} />
      </div>
      <div>
        <label>Price</label>
        <input type="number" name="price" value={property.price || 0} onChange={handleChange} />
      </div>
      <div>
        <label>Location</label>
        <input type="text" name="location" value={property.location || ''} onChange={handleChange} />
      </div>
      {/* Add other form fields similarly */}
      <button type="submit">Update</button>
    </form>
  );
};

export default PropertyEditForm;
