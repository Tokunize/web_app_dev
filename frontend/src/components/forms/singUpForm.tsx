import React, { useState, useEffect } from 'react';
import { FaArrowCircleLeft, FaCheckCircle, FaEye, FaEyeSlash } from "react-icons/fa"; // Importamos los nuevos íconos
import { MdError } from "react-icons/md";
import "../../styles/singUp.css"; // Asegúrate de que esta ruta sea correcta
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from '../ui/use-toast';
import logo from "../../assets/header.png";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input"; // Importa tu componente Input aquí
import { Button } from "@/components/ui/button"; // 

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  lastName: z.string().min(1, {
    message: "Last name is required.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long.",
  })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[0-9]/, {
      message: "Password must contain at least one number.",
    })
    .regex(/[\W_]/, {
      message: "Password must contain at least one special character.",
    }),
});

export function SignUpForm({
  email,
  setIsEmailSubmitted,
  onSignUpSuccess,
}: {
  email: string;
  setIsEmailSubmitted: React.Dispatch<React.SetStateAction<number>>; // Cambiado a number
  onSignUpSuccess: (data: any) => void; // Cambiado a recibir un argumento
}) {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordEntered, setIsPasswordEntered] = useState(false); // Nuevo estado para controlar si se ha escrito algo
  const [validations, setValidations] = useState({
    length: false,
    uppercase: false,
    number: false,
    special: false,
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      lastName: "",
      email: email, // Email se llena con el que se recibió
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const { email, password, username, lastName } = data;

    const formData = {
      email,
      password,
      name: username,
      last_name: lastName,
    };

    onSignUpSuccess(formData); 
    toast({
            title: "Thank you",
            description: "We are one step closer to set up your account.",
            duration: 2000,
             variant: "default",
    });
  }

  // Función para comprobar la fuerza de la contraseña
  const checkPasswordStrength = (password: string) => {
    setValidations({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[\W_]/.test(password),
    });
  };

  useEffect(() => {
    const password = form.watch("password"); // Observar los cambios en el campo de contraseña
    if (password) {
      setIsPasswordEntered(true); // Mostrar verificador cuando haya algo escrito
      checkPasswordStrength(password);
    } else {
      setIsPasswordEntered(false); // Ocultar verificador si está vacío
    }
  }, [form.watch("password")]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="rounded-lg p-5 h-auto bg-white space-y-6 shadow-lg">
        <button
          type="button"
          className="flex items-center text-blue-500 hover:underline"
          onClick={() => {
            setIsEmailSubmitted(1); // Cambiar a 1 para ir al paso anterior
            form.reset({ email: '' }); // Restablecer el formulario si es necesario
          }}
        >
          <FaArrowCircleLeft className="mr-2 text-[#C8E870]" />
        </button>

        <img alt='logo' src={logo} className="h-16 mx-auto mb-5" />

        {/* Campo de Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter a valid email address" {...field} />
              </FormControl>
              <FormDescription>
                You will use this email to interact with Tokunize.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campos para el nombre y apellido */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your first name" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your last name" {...field} />
                </FormControl>
                <FormDescription>
                  Please enter your last name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Campo de contraseña */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...field}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Íconos cambiados aquí */}
                  </button>
                </div>
              </FormControl>
              <FormDescription>
                Choose a strong password (min 8 characters, 1 uppercase, 1 number, 1 special character).
              </FormDescription>
              <FormMessage />
              {/* Verificar si el usuario ha comenzado a escribir la contraseña */}
              {isPasswordEntered && <PasswordStrengthIndicator validations={validations} />}
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">Submit</Button>
      </form>
    </Form>
  );
}

// Componente para mostrar las validaciones de la contraseña
function PasswordStrengthIndicator({ validations }: { validations: any }) {
  return (
    <div className="flex flex-col mt-2 space-y-1">
      <div className="flex items-center">
        {validations.length ? <FaCheckCircle className="text-[#C8E870] mr-3" /> : <MdError className="text-red-600 mr-3" />} At least 8 characters
      </div>
      <div className="flex items-center">
        {validations.uppercase ? <FaCheckCircle className="text-[#C8E870] mr-3" /> : <MdError className="text-red-600 mr-3" />} At least 1 uppercase letter
      </div>
      <div className="flex items-center">
        {validations.number ? <FaCheckCircle className="text-[#C8E870] mr-3" /> : <MdError className="text-red-600 mr-3" />} At least 1 number
      </div>
      <div className="flex items-center">
        {validations.special ? <FaCheckCircle className="text-[#C8E870] mr-3" /> : <MdError className="text-red-600 mr-3" />} At least 1 special character
      </div>
    </div>
  );
}


 // try {
        //   const response = await axios.post(
        //     'https://dev-2l2jjwfm5ekzae3u.us.auth0.com/dbconnections/signup', 
        //     finalData,
        //     { headers: { 'Content-Type': 'application/json' } }
        //   );
    
        //   toast({
        //     title: "Registration Successful!",
        //     description: "You have successfully signed up. Welcome to our community!",
        //     duration: 5000,
        //     variant: "default",
        //   });
    
        //   // Llamar al callback `onSignUpSuccess` para avanzar al siguiente paso
        //   onSignUpSuccess();  // Aquí notificamos al componente padre que el registro fue exitoso
    
        // } catch (err) {
        //   toast({
        //     title: "Registration Failed",
        //     description: "There was an error with your registration. Please try again.",
        //     duration: 5000,
        //     variant: "destructive",
        //   });
        // }