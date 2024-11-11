import { BsTriangleFill } from "react-icons/bs";
import positiveNumber from "../../../assets/postiveNumber.svg";
import negativeNumber from "../../../assets/negativeNumber.svg";

interface Props {
    propertytitle: string;
    image: string;
    tokenPriceCPM: number;
}

export const TradingMarqueeCard = ({ propertytitle, image, tokenPriceCPM }: Props) => {
    const isPositive = tokenPriceCPM > 0;
    const tokenPriceClass = isPositive ? 'text-green-500' : 'text-red-500';
    const priceIconClass = isPositive ? 'rotate-0' : 'rotate-180';
    const priceImage = isPositive ? positiveNumber : negativeNumber;

    return (
        <article className="hover:bg-[#F4FAE2] p-4 my-2 mx-5 flex space-x-4 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-xl w-auto flex-shrink-0">
            <figure className="flex-shrink-0">
                <img
                    alt={propertytitle}
                    src={image}
                    className="h-16 w-16 shadow-lg rounded-lg object-cover"
                />
            </figure>
            <div className="flex flex-col justify-between">
                <p className="text-sm font-medium text-gray-800">{propertytitle}</p>
                <div className="flex items-center space-x-2">
                    <BsTriangleFill className={`${tokenPriceClass} ${priceIconClass} transform transition-transform duration-300`} />
                    <span className={`${tokenPriceClass} text-lg font-semibold`}>
                        {tokenPriceCPM}%
                    </span>
                </div>
            </div>
            <figure className="flex-shrink-0">
                <img
                    alt={`price indicator  - ${isPositive ? 'positive' : 'negative'}`}
                    src={priceImage}
                />
            </figure>
        </article>
    );
};
