
import { PropertyAccordion } from "@/components/propertyAccordion";
import { PurchaseForm } from "@/components/buyPropertyForm";

export const SingleProperty = () => {
    return (
    <section className="md:px-[137px]">
        <div className="flex h-auto md:h-[580px] pt-8 md:pt-[100px] gap-4">
            {/* Left side: One big square */}
            <div className="w-1/2 flex justify-center items-center">
                <img
                    src="https://via.placeholder.com/300"
                    alt="Large square"
                    className="object-cover w-full h-full"
                />
            </div>
    
            {/* Right side: Four smaller squares */}
            <div className="w-1/2 grid grid-cols-2 gap-4">
                <div className="imageContainer h-full">
                    <p className="bg-gray-500 h-full"></p>
                </div>
                <div className="imageContainer h-full">
                    <p className="bg-gray-500 h-full"></p>
                </div>
                <div className="imageContainer h-full">
                    <p className="bg-gray-500 h-full"></p>
                </div>
                <div className="imageContainer h-full">
                    <p className="bg-gray-500 h-full"></p>
                </div>
            </div>
        </div>
        <div className=" flex justify-between">
            <div className="md:w-[65%]">
                <PropertyAccordion/>
            </div>
            <div className=" md:w-[30%]">
                <PurchaseForm/>
            </div>
        </div>
    </section>
    );
  };
  