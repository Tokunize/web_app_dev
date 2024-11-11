"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useToast } from "../ui/use-toast";
interface RejectPropertyFormProps {
    propertyId: string; // Cambia 'string' por el tipo correcto según tus necesidades
}

const propertyIssues = [
  "Inadequate property quality",
  "High risk profile of the property",
  "Sponsor’s limited experience or poor track record",
  "Lack of transparency in property details",
  "Negative environmental or social impact",
  "Insufficient revenue potential",
  "Legal complications or liens",
  "Property value mismatch"
];


export const RejectPropertyForm: React.FC<RejectPropertyFormProps> = ({ propertyId }) => {

  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [reasonDescription, setReasonDescription] = useState("");
  const { toast } = useToast();

  const handleCheckboxChange = (reason: string) => {
    // Cambiar la selección del checkbox
    setSelectedReason(reason === selectedReason ? null : reason);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Validar que se ha seleccionado al menos un motivo de rechazo
    if (!selectedReason) {
      toast({
        title: "Error",
        description: "Please select a reason before rejecting the property.",
        variant: "destructive"
      });
      return;
    }

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

      const data = {
        status: "rejected",
        id: propertyId,
        rejectionReason: selectedReason,
        rejectionDescription: reasonDescription
      };
      const response = await axios.put(
        `${import.meta.env.VITE_APP_BACKEND_URL}property/properties/${propertyId}/status/`,
        data,
        config
      );

      if (response.status === 200) { // Asegúrate de que el estado sea el correcto para un rechazo exitoso
        toast({
          title: "Success",
          description: "Property rejected and notification sent to the assets owner.",
          variant: "default"
        });
        
    }} catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An error occurred while rejecting the property.",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 h-auto">
      <div>
        <h3 className="font-bold text-lg mb-4">Select a reason to reject this property</h3>
        <div className="grid grid-cols-2 gap-4 ">
          {propertyIssues.map((reason) => (
            <div key={reason} className="flex items-center">
              <Checkbox
                id={reason}
                checked={selectedReason === reason}
                onCheckedChange={() => handleCheckboxChange(reason)}
              />
              <Label htmlFor={reason} className="ml-2 ">
                {reason}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="reason-description">Additional Comments</Label>
        <Textarea
          id="reason-description"
          value={reasonDescription}
          onChange={(e) => setReasonDescription(e.target.value)}
          placeholder="Provide any additional comments or details here..."
          rows={4}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="w-full" variant="destructive">
          Reject
        </Button>
      </div>
    </form>
  );
};
