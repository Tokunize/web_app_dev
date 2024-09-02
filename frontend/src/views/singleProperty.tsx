import { PropertyAccordion } from "@/components/propertyAccordion";
import { PurchaseForm } from "@/components/buyPropertyForm";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';
import { FaArrowLeft, FaShare } from 'react-icons/fa';
import { Button } from "@/components/ui/button";


interface PropertyResponse {
    image: string[];
    video_urls: string[];
}

export const SingleProperty = () => {
    const [propertyImages, setPropertyImages] = useState<string[]>([]);
    const [propertyVideos, setPropertyVideos] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

        const fetchPropertyData = async () => {
            try {
                const apiUrl = `${backendUrl}property/properties/${id}/?view=images`;
                const response = await axios.get<PropertyResponse>(apiUrl);

                setPropertyImages(response.data.image);
                setPropertyVideos(response.data.video_urls);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch property data');
            } finally {
                setLoading(false);
            }
        };

        fetchPropertyData();
    }, [id]);

    const getEmbedUrl = (videoUrl: string): string => {
        const urlParams = new URLSearchParams(new URL(videoUrl).search);
        const videoId = urlParams.get("v");
        return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : '';
    };

    const showImages = () => {
        return propertyImages.slice(1, 5).map((image, index) => (
            <div key={index} className="imageContainer h-full">
                <img 
                    src={image} 
                    alt={`Property Image ${index + 1}`} 
                    className={`object-cover w-full h-full ${index % 2 === 0 ? 'rounded-2xl' : ''}`}
                />
            </div>
        ));
    };
    

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <section className="md:px-[80px]">
             <div className="flex justify-between items-center md:py-[20px]">
                <div className="flex items-center space-x-2">
                    <span className="bg-[#A0CC29] rounded-full p-1"><FaArrowLeft className="text-white" /></span>
                    <span className="text-xs cursor-pointer">Back to Marketplace</span>
                </div>
                
                {/* Right Side: Share Button */}
                <Button variant="outline" className="flex items-center space-x-2">
                    <FaShare className="text-gray-700" />
                    <span className="text-gray-700">Share</span>
                </Button>
            </div>
            <div className="flex flex-row h-auto md:h-[580px] gap-4">
                {/* Left side: Video in a big square */}
                <div className="w-1/2 flex justify-center items-center">
                    {propertyVideos[0] && (
                        <iframe
                            width="100%"
                            height="100%"
                            src={getEmbedUrl(propertyVideos[0])}
                            title="Property Video"
                            frameBorder="0"
                            className="rounded-l-2xl"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    )}
                </div>

                {/* Right side: Four smaller squares */}
                <div className="w-1/2 grid grid-cols-2 gap-4">
                    {showImages()}
                </div>
            </div>

            <div className="flex justify-between mt-8">
                <div className="md:w-[65%]">
                    <PropertyAccordion />
                </div>
                <div className="md:w-[30%]">
                    <PurchaseForm />
                </div>
            </div>
        </section>
    );
};
