import React, { useState, FormEvent } from 'react';
import axios from 'axios';

const SignUpForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [surname, setSurname] = useState<string>(''); // Estado para surname
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<string>('Investor');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleRoleChange = (selectedRole: string) => {
    
    setRole(selectedRole.toLowerCase());
    console.log(selectedRole.toLowerCase());

  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const data = {
      client_id: 'RkDK38n0VPNZEmuv0ZgQx9P93rLPAOTK',  // Reemplaza con tu Auth0 Client ID
      email,
      password,
      connection: 'Username-Password-Authentication', // Conexión por defecto
      user_metadata: { name, surname, role } // Incluye surname y role en user_metadata
    };

    try {
      const response = await axios.post(
        'https://dev-2l2jjwfm5ekzae3u.us.auth0.com/dbconnections/signup', // Reemplaza con tu Auth0 domain
        data,
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log(response.data);
      setSuccess(true);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Registration failed. Please try again.');
      setSuccess(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="surname" className="block text-sm font-medium text-gray-700">Surname:</label>
          <input
            type="text"
            id="surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => handleRoleChange('Investor')}
            style={{
              backgroundColor: role === 'Investor' ? '#A9D15C' : '#C8E870',
              color: '#fff'
            }}
            className={`flex-1 py-2 px-4 rounded-md font-semibold ${role === 'Investor' ? 'shadow-lg' : 'hover:bg-yellow-200'}`}
          >
            Investor
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('Owner')}
            style={{
              backgroundColor: role === 'Owner' ? '#A9D15C' : '#C8E870',
              color: '#fff'
            }}
            className={`flex-1 py-2 px-4 rounded-md font-semibold ${role === 'Owner' ? 'shadow-lg' : 'hover:bg-yellow-200'}`}
          >
            Owner
          </button>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Sign Up
        </button>
      </form>
      {error && <p className="mt-4 text-red-500 text-sm text-center">{error}</p>}
      {success && <p className="mt-4 text-green-500 text-sm text-center">Registration successful!</p>}
    </div>
  );
};

export default SignUpForm;
