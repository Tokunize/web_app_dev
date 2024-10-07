import { Carousel } from 'flowbite-react';
import { Button } from '@/components/ui/button';
import singUpOwner3 from "../../assets/singUpOwner3.png";
import singUpOwner2 from "../../assets/singUpOwner2.png";
import singUpOwner1 from "../../assets/singUpOwner1.png";

interface OwnerFlowCarouselProps {
    onConfirm: () => void; // Especificar el tipo de onConfirm como una función que no toma argumentos y no retorna nada
}

export const OwnerFlowCarousel: React.FC<OwnerFlowCarouselProps> = ({ onConfirm }) => {
    const slides = [
        {
            title: 'List Your Property Effortlessly!',
            description: 'Create your first listing to sell partial or full equity in just a few minutes.',
            imageUrl: singUpOwner1
        },
        {
            title: 'Simplify Your Management.',
            description: 'Handle everything in one place. We manage the legal paperwork, tax implications, and payment processing for you.',
            imageUrl: singUpOwner2
        },
        {
            title: 'Instant Withdraw',
            description: 'Cash out instantly with no delays. It’s seamless, straightforward, and built for your needs.',
            imageUrl: singUpOwner3
        },
    ];


    const handleConfirm = () => {
        onConfirm(); // Llama a la función onConfirm pasada como prop
    };

    return (
        <article className="w-full p-6 flex flex-col custom-landing-carousel">
            <Carousel slideInterval={5000} className="w-full h-[480px] mb-[80px]">
                {slides.map((slide, index) => (
                    <div key={index} className="flex flex-col justify-center items-center text-center h-full p-6">
                        <h2 className="text-2xl font-semibold mb-2">{slide.title}</h2>
                        <p className="text-gray-600 mb-6">{slide.description}</p>
                        <div className="flex justify-center">
                            <img
                                src={slide.imageUrl}
                                alt={slide.title}
                                className="max-h-full max-w-full object-contain rounded-lg"
                            />
                        </div>
                    </div>
                ))}
            </Carousel>
            <Button onClick={handleConfirm}>Confirm</Button> {/* Llamamos a handleConfirm para manejar el redireccionamiento */}
        </article>
    );
};
