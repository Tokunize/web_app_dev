import bannerImg from "../assets/img/Banner.png";
import { useToast } from "@/hooks/use-toast"
import { Button } from "./ui/button";

export const Herobanner = () => {
  const { toast } = useToast()

  return (
    <article
      className="rounded-lg bg-black flex flex-col justify-center pl-[20px] space-y-5 py-[40px] bg-cover bg-center"
      style={{ backgroundImage: `url(${bannerImg})` }}
      >
      <h3 className="text-white tracking-wide font-bold text-3xl leading-relaxed">
        Invest in Rental Properties, <br/> Without the Headache.
      </h3>
      <Button
      onClick={() => {
        toast({
          title: "Scheduled: Catch up",
          description: "Friday, February 10, 2023 at 5:57 PM",
        })
      }}
    >
      Show Toast
    </Button>

    </article>
  );
};
