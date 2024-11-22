import React, { useState } from "react";
import { GoogleIcon } from "../../assets/icons/icons";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginValidationSchema } from "../../lib/validators";
import { z } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useAuth } from "../../context/UseAuth";
import { Loader2 } from "lucide-react";
import { useToast } from "../ui/use-toast";

const LoginForm: React.FC<{
  setIsLoginActive: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSignupActive: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setIsLoginActive, setIsSignupActive }) => {
  const { login } = useAuth();
  const { toast } = useToast();

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  const form = useForm<z.infer<typeof loginValidationSchema>>({
    resolver: zodResolver(loginValidationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof loginValidationSchema>) => {
    setIsLoggingIn(true);

    try {
      await login(data);

      setIsLoginActive(false);

      toast({
        title: "Logged in",
        description: "You have been successfully logged in.",
        className:
          "bg-green-500 text-white text-3xl font-semibold ring-0 border-none",
      });
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(
          error.message === "Request failed with status code 404" ||
            error.message === "Request failed with status code 401"
            ? "Invalid email or password"
            : error.message
        );
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogin = () => {
    window.open("http://localhost:5000/auth/google", "_self");
  };

  return (
    <div className="w-full flex flex-col gap-y-6">
      <div className="flex flex-col gap-y-2">
        <h3 className="text-gray-900 font-bold text-2xl">Welcome Back</h3>
        <p className="text-sm font-medium text-neutral-600">
          Sign up or log in to continue
        </p>
      </div>
      <div className="flex flex-col gap-y-3">
        <button
          onClick={handleGoogleLogin}
          className="relative flex items-center justify-center px-4 py-2 bg-white border border-black/10 rounded-md hover:opacity-75 transition-all"
        >
          <img
            src={GoogleIcon}
            width={24}
            height={24}
            className="absolute top-2 left-3"
          />
          Continue with Google
        </button>
        <p className="text-center font-semibold text-neutral-600 text-sm">or</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name={"email"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="your email"
                      className="w-full rounded-md border-none ring-1 py-5 ring-gray-900/20 text-base focus-visible:ring-1 focus-visible:ring-gray-900/85 outline-none focus-visible:ring-offset-0 transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"password"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="your password"
                      className="w-full rounded-md border-none ring-1 py-5 ring-gray-900/20 text-base focus-visible:ring-1 focus-visible:ring-gray-900/85 outline-none focus-visible:ring-offset-0 transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {errorMessage && (
              <p className="text-center font-semibold text-base text-red-500">
                {errorMessage}
              </p>
            )}
            <Button
              type="submit"
              disabled={isLoggingIn}
              className="w-full rounded-md ring-1 ring-primary"
            >
              {isLoggingIn ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Form>
        <Button
          type="button"
          onClick={() => {
            setIsLoginActive(false);
            setIsSignupActive(true);
          }}
          className="w-full rounded-md bg-white ring-1 ring-primary primary-text hover:bg-primary hover:text-white"
        >
          Sign up
        </Button>
      </div>
    </div>
  );
};

export default LoginForm;
