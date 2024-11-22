import React, { useEffect, useState } from "react";
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
import { loginValidatorSchema } from "../../lib/validators";
import { z } from "zod";
import { Input } from "../ui/input";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

const LoginForm: React.FC = () => {
  const { login, token } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [navigate, token]);

  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const form = useForm<z.infer<typeof loginValidatorSchema>>({
    resolver: zodResolver(loginValidatorSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof loginValidatorSchema>) => {
    setIsLoggingIn(true);

    try {
      await login(data);

      navigate("/");
      form.reset();
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Request failed with status code 404") {
          setErrorMessage("Restaurant not found");
        } else if (error.message === "Request failed with status code 401") {
          setErrorMessage("Invalid email or password");
        } else {
          setErrorMessage("Something went wrong");
        }
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <section className="w-full h-screen flex items-center justify-center">
      <div className="w-[420px] shadow-lg shadow-black/15 flex flex-col rounded-md justify-center gap-y-6 p-4">
        <img
          src="../../../public/logo.png"
          alt="logo"
          className="size-10 object-contain object-center self-center"
        />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-2.5"
          >
            <FormField
              control={form.control}
              name={"email"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="restaurant email"
                      className="border-gray-950/25 focus-visible:border-gray-950 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-all"
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
                      placeholder="restaurant password"
                      className="border-gray-950/25 focus-visible:border-gray-950 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {errorMessage && (
              <p className="text-sm font-semibold text-center text-red-500">
                {errorMessage}
              </p>
            )}
            <Button type="submit" disabled={isLoggingIn} className="w-full">
              {isLoggingIn ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </section>
  );
};

export default LoginForm;
