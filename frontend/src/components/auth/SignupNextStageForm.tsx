import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { signUpValidationShcema } from "../../lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import { signupUser } from "../../lib/actions";
import { Loader2 } from "lucide-react";

const SignupNextStageForm: React.FC<{
  email: string;
  setIsLoginActive: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSignupActive: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ email, setIsLoginActive, setIsSignupActive }) => {
  const form = useForm<z.infer<typeof signUpValidationShcema>>({
    resolver: zodResolver(signUpValidationShcema),
    defaultValues: {
      name: "",
      nickname: "",
      email: email,
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate: signupMutation, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof signUpValidationShcema>) => {
      await signupUser(data);
    },
    onSuccess: () => {
      setIsSignupActive(true);
      setIsLoginActive(true);
      form.reset();
    },
  });

  const onSubmit = (data: z.infer<typeof signUpValidationShcema>) => {
    signupMutation(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5">
        <div className="w-full grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Name <span className="primary-text">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="your name"
                    className="w-full rounded-sm border-none ring-1 ring-gray-900/20 text-sm focus-visible:ring-1 focus-visible:ring-gray-900/85 outline-none focus-visible:ring-offset-0 transition-all"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nickname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nickname</FormLabel>
                <FormControl>
                  <Input
                    placeholder="your nickname"
                    className="w-full rounded-sm border-none ring-1 ring-gray-900/20 text-sm focus-visible:ring-1 focus-visible:ring-gray-900/85 outline-none focus-visible:ring-offset-0 transition-all"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Email <span className="primary-text">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  disabled
                  className="w-full rounded-sm border-none text-sm ring-1 ring-gray-900/85 outline-none disabled:opacity-100 disabled:cursor-default"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Phone Number <span className="primary-text">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="your phone number"
                  className="w-full rounded-sm border-none ring-1 ring-gray-900/20 text-sm focus-visible:ring-1 focus-visible:ring-gray-900/85 outline-none focus-visible:ring-offset-0 transition-all"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Password <span className="primary-text">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="your password"
                    className="w-full rounded-sm border-none ring-1 ring-gray-900/20 text-sm focus-visible:ring-1 focus-visible:ring-gray-900/85 outline-none focus-visible:ring-offset-0 transition-all"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Confirm Password <span className="primary-text">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="confirm your password"
                    className="w-full rounded-sm border-none ring-1 ring-gray-900/20 text-sm focus-visible:ring-1 focus-visible:ring-gray-900/85 outline-none focus-visible:ring-offset-0 transition-all"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          disabled={isPending}
          className="w-full rounded-md py-6 disabled:bg-black/60"
        >
          {isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : "Sign up"}
        </Button>
      </form>
    </Form>
  );
};

export default SignupNextStageForm;
