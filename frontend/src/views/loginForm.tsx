// src/components/LoginForm.tsx

import * as React from "react";
import { cn } from "@/lib/utils"; // Asegúrate de tener esto para la clase cn
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios"; // Asegúrate de instalar axios
import { Link } from 'react-router-dom';

interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const LoginForm = ({ className, ...props }: LoginFormProps) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(null); // Resetea el mensaje de error en cada intento

    try {
      // Cambia estos valores con tu información de Auth0
      const domain = "dev-2l2jjwfm5ekzae3u.us.auth0.com"; // e.g., "dev-abc123.us.auth0.com"
      const clientId = "RkDK38n0VPNZEmuv0ZgQx9P93rLPAOTK"; // Tu Client ID de Auth0
      const audience = "https://dev-assingroles/roles"; // Tu API Identifier
      const grantType = "password"; // El flujo que estás utilizando
      const connection = "Username-Password-Authentication"; // Nombre de la conexión que creaste


      const response = await axios.post(`https://${domain}/oauth/token`, {
        grant_type: grantType,
        username: email,
        password: password,
        audience: audience,
        connection: connection, // Añade la conexión aquí
        client_id: clientId,
        scope: "openid profile email",
      });

      // Maneja el token de respuesta según lo que necesites hacer
      console.log("Login Successful:", response.data);
      // Aquí puedes guardar el token en el estado o en local storage

    } catch (error: any) {
      setErrorMessage(error.response?.data?.error_description || "Error durante el inicio de sesión. Por favor intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg", className)} {...props}>
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      <form onSubmit={onSubmit}>
        <div className="grid gap-4">
          {errorMessage && <div className="text-red-600 mb-2 text-center">{errorMessage}</div>}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-2 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="Enter your password"
              type="password"
              autoCapitalize="none"
              autoComplete="current-password"
              autoCorrect="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-2 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>
          <Button type="submit" className="w-full mt-4" disabled={isLoading}>
            {isLoading ? "Loading..." : "Login"}
          </Button>
        </div>
      </form>
      <p className="mt-4 text-center text-sm">
        <Link to="/forgot-password" className="text-blue-500 hover:underline">Forgot your password?</Link>
      </p>
    </div>
  );
}

export default LoginForm;
