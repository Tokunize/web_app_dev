import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export const BlogSubscriberForm: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setError('');
        setSuccess('');

        try {
            await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}blog/subscriber/`, { email });
            setSuccess('Subscription successful!');
            setEmail(''); // Clear the input field

        } catch (error) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    return (
        <form onSubmit={handleSubmit} className="flex space-x-4">
            <div>
                <label htmlFor="email" className="hidden">Email:</label>
                <Input 
                    id="email"
                    type="email"
                    value={email}
                    placeholder="Enter Your Email"
                    onChange={handleChange}
                    required
                />
            </div>
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Sign Up'}
            </Button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
        </form>
    );
};
