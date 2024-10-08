"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useToast } from "../ui/use-toast";
import { createNotification } from "../notificationService";

interface RejectPropertyFormProps {
    propertyId: number; // Cambia 'string' por el tipo correcto según tus necesidades
}

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
        rejection_reason: `Rejected: The reason is "${selectedReason}". Additional comments: "${reasonDescription}".`
      };
      const response = await axios.put(
        `${import.meta.env.VITE_APP_BACKEND_URL}property/properties/${propertyId}/status/`,
        data,
        config
      );

      console.log('Response:', response.data);

      // Crear una notificación si la propiedad fue rechazada exitosamente
      if (response.status === 200) { // Asegúrate de que el estado sea el correcto para un rechazo exitoso
        const notificationData = {
            message: `Rejected: The reason is "${selectedReason}". Additional comments: "${reasonDescription}".`,
            property_id: propertyId,
            notification_type: "admin_broadcast", // Agregar tipo de notificación si es necesario
        };

        // Llama a la función para crear la notificación
        await createNotification(notificationData, accessToken);

        // Muestra un toast de éxito
        toast({
          title: "Success",
          description: "Property rejected and notification sent.",
          variant: "default"
        });
      }

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An error occurred while rejecting the property.",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="font-bold text-lg mb-4">Select a Reason for Rejection</h3>
        <div className="grid grid-cols-2 gap-4">
          {["Reason 1", "Reason 2", "Reason 3", "Reason 4"].map((reason) => (
            <div key={reason} className="flex items-center">
              <Checkbox
                id={reason}
                checked={selectedReason === reason}
                onCheckedChange={() => handleCheckboxChange(reason)}
              />
              <Label htmlFor={reason} className="ml-2">
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
