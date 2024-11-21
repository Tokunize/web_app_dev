import React, { useState, useEffect } from "react";
import { Carousel } from "flowbite-react";
import token from "../../assets/token.svg";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface PropertyListCardProps {
    title: string;
    location: string;
    minTokenPrice: string;
    estAnnualReturn: string;
    propertyImgs: string[];
    id: string;
    tokensSold: number;
    totalTokens: number;
    status: string;
    tokens_available: number;
    rejection_reason: string,
    rejectionReasonComment:string;
}

export const OwnerPropertyListCard: React.FC<PropertyListCardProps> = ({
    title,
    location,
    minTokenPrice,
    estAnnualReturn,
    propertyImgs,
    status,
    tokens_available,
    id,
    rejection_reason,
    rejectionReasonComment
}) => {
    const [badgeType, setBadgeType] = useState<string | null>(null);
    const { role} = useSelector((state: RootState) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (status === "under_review") {
            setBadgeType('Under Review');
        } else if (status === "published") {
            setBadgeType('Published');
        } else if (status === "coming_soon") {
            setBadgeType('Coming Soon');
        } else if (status === "rejected") {
            setBadgeType('Rejected');
        } else {
            setBadgeType(null);
        }
    }, [status]);

    return (
        <article className="relative rounded-lg overflow-hidden mt-6">
            <div className="h-64 relative">
                {/* Badge de estado */}
                {badgeType && (
                    <div className="absolute top-4 left-4 flex items-center text-xs font-semibold py-1 px-2 rounded-lg z-20 bg-gray-300 text-black">
                        <span
                            className={`mr-2 w-2 h-2 rounded-full ${
                                badgeType === 'Under Review' ? 'bg-yellow-500' : 
                                badgeType === 'Coming Soon' ? 'bg-blue-500' : 
                                badgeType === 'Rejected' ? 'bg-red-500' : 
                                'bg-green-500'
                            }`}
                        />
                        {badgeType}
                    </div>
                )}

                {/* Badge y botón de actualización solo si el estado no es "published" */}
                {status !== "published" && role === "admin" && (
                    <div className="absolute top-4 right-4 z-20">
                        <span className="bg-blue-500 text-white text-xs font-semibold py-1 px-2 rounded-md shadow-md cursor-pointer" 
                            onClick={() => navigate(`/dashboard-property/${id}`)} 
                        >
                            Update
                        </span>
                    </div>
                )}

                <Carousel
                    indicators={true}
                    slide={false}
                    className="custom-landing-carousel"
                >
                    {propertyImgs.map((img, index) => (
                        <div key={index} className={`relative w-full h-full ${status === 'rejected' ? 'overlay' : ''}`}>
                            <img
                                src={img}
                                alt={`${title} image ${index + 1}`}
                                className={`w-full h-full object-cover ${status === 'rejected' ? 'opacity-60' : ''}`}
                            />
                            {/* Overlay gris si está rechazado */}
                            {status === 'rejected' && (
                                <div className="absolute inset-0 bg-gray-500 opacity-50"></div>
                            )}
                        </div>
                    ))}
                </Carousel>
            </div>

            <div className="py-3">
                <div className="flex flex-row justify-between items-start">
                    <h2 className="text-xl font-semibold mb-2">{title}</h2>
                    {tokens_available > 0 && (
                        <div className="flex items-center justify-end mt-2">
                            <div className="text-sm text-gray-500 flex items-center">
                                <span>
                                    <img src={token} alt="token" className="inline-block h-[20px] w-[20px] mr-2" />
                                </span> 
                                {tokens_available} Tokens Left
                            </div>
                        </div>
                    )}
                </div>
                <p className="text-gray-600 mb-4">{location}</p>

                {minTokenPrice && (
                    <div className="flex justify-between mb-2">
                        <p className="font-medium">£{minTokenPrice}</p>
                        <span className="text-gray-500">Min. token price</span>
                    </div>
                )}

                {estAnnualReturn && (
                    <div className="flex justify-between">
                        <p className="font-medium">{estAnnualReturn}%</p>
                        <span className="text-gray-500">Est. annual returns</span>
                    </div>
                )}
                 {status === "rejected" && rejection_reason && (
                    <div className="mt-2 p-3 space-y-2 bg-red-100 rounded-lg text-red-700 text-sm">
                        <div className="flex items-center space-x-2">
                            <span className="font-semibold">Property Status:</span>
                            <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                        </div>
                        <div className=" items-center space-x-2">
                            <span className="font-semibold">Reason:</span>
                            <span>{rejection_reason}</span>
                        </div>
                        <div className=" items-center space-x-2">
                            <span className="font-semibold">Extra Details:</span>
                            <span>{rejectionReasonComment}</span>
                        </div>
                  </div>
                )}
            </div>
        </article>
    );
};
