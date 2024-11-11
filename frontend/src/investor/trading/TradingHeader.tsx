import { TradingMarqueeCard } from "./TradingMarqueeCard";
import Marquee from "react-fast-marquee";

const properties = [
    {
        "propertytitle": "Luxury Villa",
        "description": "A beautiful luxury villa with ocean view.",
        "image": "https://images.unsplash.com/photo-1448630360428-65456885c650?q=80&w=2667&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "tokenPriceCPM": 2.5  
    },
    {
        "propertytitle": "Modern Apartment",
        "description": "A sleek modern apartment in the city center.",
        "image": "https://images.unsplash.com/photo-1448630360428-65456885c650?q=80&w=2667&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "tokenPriceCPM": -1.5 
    },
    {
        "propertytitle": "Cozy Cabin",
        "description": "A charming cabin in the woods for a peaceful retreat.",
        "image": "https://images.unsplash.com/photo-1448630360428-65456885c650?q=80&w=2667&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "tokenPriceCPM": 1
    }
]

export const TradingHeader = () => {
    return (
        <div className="grid grid-cols-1">
            <Marquee
                gradient={false}
                pauseOnHover={true}
                className="w-full flex justify-around" // Make sure the marquee takes full width of the container
            >
                {properties.map((property, index) => (
                    <TradingMarqueeCard
                        key={index}
                        tokenPriceCPM={property.tokenPriceCPM}
                        propertytitle={property.propertytitle}
                        image={property.image}
                    />
                ))}
            </Marquee>
        </div>
    );
};
