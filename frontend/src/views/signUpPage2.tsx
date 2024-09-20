import { Link } from 'react-router-dom';
import { UserAuthForm } from './signUpForm';
import SmallLogo from '../assets/img/logo.jpg'
import backgroundImage from '../assets/heroImg.webp'

function AuthenticationPage() {
  return (
    <div className="flex min-h-screen text-white">
      {/* Left Panel */}
      <div className="w-1/2 flex flex-col justify-between px-12 py-6"
      style={{ 
        backgroundImage: `url(${backgroundImage})`, // Adjust the path as necessary
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
      >
        <img src={SmallLogo} alt="Your Logo" className="w-36 " />
        <div>
          <p className="text-xl font-light">
            “This library has saved me countless hours of work and helped me deliver stunning designs to my clients faster than ever before.”
          </p>
          <p className="text-sm mt-4">Sofia Davis</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-1/2 bg-white text-black flex flex-col justify-center p-12">
        <nav className="absolute top-4 right-12 flex space-x-2.5">
            <div>
                <Link to="/" className="text-black hover:underline">Home</Link>
            </div>
            <div>
                <Link to="/" className="text-black hover:underline">Marketplace</Link>
            </div>
            <div>
                <Link to="/" className="text-black hover:underline">Learn</Link>
            </div>
            <div>
                <Link to="/login" className="text-black hover:underline">Login</Link>
            </div>
        </nav>
        <div>
          <h2 className="text-2xl font-bold mb-4">Create an account</h2>
          <p className="mb-4">Enter your email below to create your account</p>
          <UserAuthForm className="text-black" />
          <p className="mt-4">
            By clicking continue, you agree to our <Link to="/terms" className="text-blue-500 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-blue-500 hover:underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthenticationPage;
