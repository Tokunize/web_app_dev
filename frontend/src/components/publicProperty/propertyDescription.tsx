import React from "react";
import { Textarea } from "@/components/ui/textarea";

export const PropertyDescription: React.FC<{ description: string; setDescription: React.Dispatch<React.SetStateAction<string>> }> = ({ description, setDescription }) => {
    const letterCount = description.length;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
        const inputValue = e.target.value;
        setDescription(inputValue); // Update the description in state
    };

    return (
        <div>
            <h2 className="font-bold text-3xl">Create a description for this property</h2>
            <p className="text-sm text-gray-500">Share what makes your place special.</p>
            <Textarea
                className="mt-[50px]"
                rows={10}
                maxLength={500}
                value={description}
                onChange={handleChange}
                placeholder="Detailed descriptions of key features, property history, and value propositions."
            />
            <span className="text-sm text-gray-500 mt-2">{letterCount} / 500</span>
        </div>
    );
};
