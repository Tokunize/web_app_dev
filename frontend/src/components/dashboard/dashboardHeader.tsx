import { useAuth0 } from '@auth0/auth0-react';

const DashboardHeader = () => {
  const { user, isLoading } = useAuth0();

  return (
    <div className="flex justify-end items-center p-5">
      <span className="text-xl font-bold">
        {isLoading ? 'Loading...' : user ? `Welcome back, ${user.name}!` : 'Welcome!'}
      </span>
    </div>
  );
};

export default DashboardHeader;
