import { Button } from "./ui/button";

export const Herobanner = () => {
  return (
    <article className="rounded-lg bg-black flex flex-col justify-center pl-6 space-y-5 p-10">
      <h2 className="text-white tracking-wide font-bold text-3xl">Discover your perfect investment</h2>
      <p className="text-[#EBFABE] tracking-normal">If you have any question, let us know</p>
      <Button className="bg-custom-gray text-black w-[7%]">
        Contact Us
      </Button>
    </article>
  );
}
