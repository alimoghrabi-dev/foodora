import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { restaurantRegistrationValidationSchema } from "../../lib/validators";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import * as z from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import { createNewRestaurant } from "../../lib/actions";
import { Loader2 } from "lucide-react";
import { useToast } from "../ui/use-toast";

const RegistrationRestaurantForm: React.FC<{
  email: string;
  token: string | null;
  isTheirAnAccount: boolean;
  refetch: () => void;
}> = ({ email, token, isTheirAnAccount, refetch }) => {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof restaurantRegistrationValidationSchema>>({
    resolver: zodResolver(restaurantRegistrationValidationSchema),
    defaultValues: {
      restaurantName: "",
      email: email,
      password: "",
      confirmPassword: "",
      phoneNumber: "",
    },
  });

  useEffect(() => {
    form.setValue("email", email);
  }, [email, form]);

  const { mutateAsync: createRestaurantMutation, isPending } = useMutation({
    mutationFn: async (
      data: z.infer<typeof restaurantRegistrationValidationSchema>
    ) => {
      await createNewRestaurant(data, token);
    },
    onSuccess: () => {
      toast({
        title: "Restaurant created successfully",
        className:
          "bg-green-500 text-white text-3xl font-semibold ring-0 border-none",
      });

      refetch();

      form.reset();
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (
    data: z.infer<typeof restaurantRegistrationValidationSchema>
  ) => {
    await createRestaurantMutation(data);
  };

  return isTheirAnAccount ? (
    <div className="w-full md:w-[75%] lg:w-1/2 flex flex-col items-center justify-center gap-y-2 pt-12">
      <p className="w-full flex gap-x-1.5 font-semibold text-gray-950 text-2xl break-words text-center">
        You have successfully created your restaurant, you can now log in to
        foodora merchant and wait for order! Enjoy!
      </p>
      <a
        href=""
        className="text-2xl font-semibold primary-text hover:underline"
      >
        Visit foodora merchant
      </a>
    </div>
  ) : (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="w-full md:w-[75%] lg:w-1/2 space-y-2.5"
      >
        <FormField
          control={form.control}
          name="restaurantName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Restaurant Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="your restaurant name"
                  className="border-black/25 font-medium focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary transition-all outline-none hover:border-black/60 disabled:opacity-100"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  disabled
                  className="font-medium border-primary ring-0 disabled:opacity-100"
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
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input
                  placeholder="your phone number"
                  className="border-black/25 font-medium focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary transition-all outline-none hover:border-black/60 disabled:opacity-100"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-x-2.5">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="your password"
                    className="border-black/25 font-medium focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary transition-all outline-none hover:border-black/60 disabled:opacity-100"
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
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="confirm your password"
                    className="border-black/25 font-medium focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary transition-all outline-none hover:border-black/60 disabled:opacity-100"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? (
            <Loader2 size={16} className="text-white animate-spin" />
          ) : (
            "Register"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default RegistrationRestaurantForm;
