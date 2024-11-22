import React from "react";
import { useToast } from "../components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { driverApplyFormValidationSchema } from "../lib/validators";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Loader2 } from "lucide-react";
import { createDriverApply } from "../lib/actions";

const DriverApply: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof driverApplyFormValidationSchema>>({
    resolver: zodResolver(driverApplyFormValidationSchema),
    defaultValues: {
      driverName: "",
      email: "",
      phoneNumber: "",
      address: "",
      licenseNumber: "",
      vehicleType: "",
      vehicleNumber: "",
      licenseType: "",
    },
  });

  const { mutate: applyMutation, isPending } = useMutation({
    mutationFn: async (
      data: z.infer<typeof driverApplyFormValidationSchema>
    ) => {
      await createDriverApply(data);
    },
    onSuccess: () => {
      toast({
        title: "Your application has been submitted",
        description: "An email will be sent to your inbox soon.",
        className:
          "bg-green-500 text-white text-3xl font-semibold ring-0 border-none",
      });

      queryClient.invalidateQueries({ queryKey: ["auth-status"] });

      navigate("/");
      form.reset();
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (
    data: z.infer<typeof driverApplyFormValidationSchema>
  ) => {
    applyMutation(data);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-y-8 mt-24 sm:mt-12">
      <div className="flex flex-col items-center justify-center gap-y-3">
        <h2 className="text-gray-950 font-bold text-[22px] md:text-3xl">
          Be a{" "}
          <span className="primary-text lilita_one_font text-[26px] md:text-[36px]">
            foodora
          </span>{" "}
          Driver!
        </h2>
        <div className="w-32 h-px bg-black/15" />
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="w-[93%] sm:w-[90%] md:w-[65%] xl:w-[40%] space-y-4"
        >
          <div className="w-full grid grid-cols-2 gap-x-2">
            <FormField
              control={form.control}
              name="driverName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Driver Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="your restaurant name"
                      className="w-full outline-none border-black/25 focus-visible:border-primary/85 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all"
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
                <FormItem className="w-full">
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="your email"
                      className="w-full outline-none border-black/25 focus-visible:border-primary/85 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full grid grid-cols-2 gap-x-2">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="phone number to contact"
                      className="w-full outline-none border-black/25 focus-visible:border-primary/85 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="your address"
                      className="w-full outline-none border-black/25 focus-visible:border-primary/85 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full grid grid-cols-2 gap-x-2">
            <FormField
              control={form.control}
              name="licenseNumber"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>License Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="your license number"
                      className="w-full outline-none border-black/25 focus-visible:border-primary/85 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="licenseType"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>License Type</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="your license type"
                      className="w-full outline-none border-black/25 focus-visible:border-primary/85 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full grid grid-cols-2 gap-x-2">
            <FormField
              control={form.control}
              name="vehicleType"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Vehicle Type</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="your vehicle type"
                      className="w-full outline-none border-black/25 focus-visible:border-primary/85 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vehicleNumber"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Vehicle Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="your vehicle number"
                      className="w-full outline-none border-black/25 focus-visible:border-primary/85 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all"
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
            className="w-full font-semibold disabled:bg-neutral-600"
          >
            {isPending ? <Loader2 className="size-4 animate-spin" /> : "Apply"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default DriverApply;
