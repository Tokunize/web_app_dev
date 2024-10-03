import bannerImg from "../assets/img/Banner.png";

export const Herobanner = () => {
  return (
    <article
      className="rounded-lg bg-black flex flex-col justify-center pl-[20px] mt-5 space-y-5 py-[40px] bg-cover bg-center"
      style={{ backgroundImage: `url(${bannerImg})` }}
      >
      <h3 className="text-white tracking-wide font-bold text-3xl leading-relaxed">
        Invest in Rental Properties, <br/> Without the Headache.
      </h3>
    </article>
  );
};
