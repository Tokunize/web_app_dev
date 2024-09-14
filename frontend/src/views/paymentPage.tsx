import useFetchPropertyDetails from "@/components/property/getDetailsHook";
import { useParams } from "react-router-dom";
import { BackButton } from "@/components/buttons/backButton";
import { Carousel } from "flowbite-react";
import { TokenPurchaseForm } from "@/components/forms/tokenPurchaseForm";

export const PaymentPage: React.FC = () => {
    const { property_id } = useParams<{ property_id: string }>();
    if (!property_id) {
        return <div>Error: Property ID is missing in the URL</div>;
    }

    const propertyIdNumber = parseInt(property_id, 10);
    if (isNaN(propertyIdNumber)) {
        return <div>Error: Invalid Property ID</div>;
    }

    const { data, loading, error } = useFetchPropertyDetails(propertyIdNumber, "payment");
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <section className="sm:px-[80px]">
            <BackButton />
            <div className="flex sm:pl-[80px] sm:mt-[60px] justify-between ">
                <article className="w-1/2 space-y-3">
                    <h3 className="font-bold text-2xl text-[#C7E770] ">{data?.title}</h3>
                    <h4 className="font-bold text-lg">Order summary</h4>
                    <ul className="space-y-2">
                        <li className="flex justify-between">Property Managment <span>£ 2</span></li>
                        <li className="flex justify-between">Property Managment <span>£ 2</span></li>
                        <li className="flex justify-between">Property Managment <span>£ 2</span></li>
                        <li className="flex justify-between">Property Managment <span>£ 2</span></li>
                        <li className="flex justify-between">Property Managment <span>£ 2</span></li>
                        <hr/>
                        <li className="flex justify-between font-bold">Total<span>£ 10</span></li>
                    </ul>
                    <p>Token Price £{data?.tokens[0].token_price} </p>

                    <h4 className="font-bold text-lg">Payment Method</h4>
                    <TokenPurchaseForm property_id={data?.id} token_price ={data?.tokens[0].price}/>
                    {/* <Button variant="default" className="w-full">Confirm buy Order</Button> */}
                </article>
                
                <aside className="w-1/3 flex flex-col text-left">
                    <Carousel
                        indicators={true} 
                        slide={false}
                        className="h-[50%]"
                        >
                        {data?.image.map((img, index) => (
                            <img
                            key={index}
                            src={img}
                            alt={`${data?.title} image ${index + 1}`}
                            className="w-full h-full object-cover"
                            />
                        ))}
                    </Carousel>
                    <p className="font-semibold mt-3">{data?.title}</p>
                    <p className="text-xs">{data?.location}</p>
                </aside>
            </div>
        </section>

    );
};
