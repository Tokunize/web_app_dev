import { useUser } from "@/context/userProvider";


export const DashboardHeader = () => {
  const { name } = useUser();

  return (
    <div className="flex justify-start items-center">
      <span className="text-lg font-normal">
        {`Welcome back, ${name}`}
      </span>
    </div>
  );
};

