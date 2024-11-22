import React, { useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Button } from "../components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { storeInfoValidationSchema } from "../lib/validators";
import { z } from "zod";
import { useAuth } from "../context/useAuth";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import HandleImageChange from "../components/shared/HandleImageChange";
import { Check, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeStoreInfo } from "../lib/actions";
import { useToast } from "../components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import RenderImage from "../components/shared/RenderImage";
import HandleEmailVerification from "../components/shared/HandleEmailVerification";

const CompleteInfo: React.FC = () => {
  const { admin, token } = useAuth();
  const { toast } = useToast();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof storeInfoValidationSchema>>({
    resolver: zodResolver(storeInfoValidationSchema),
    defaultValues: {
      deliveryTime: admin?.deliveryTime || "",
      cuisine: admin?.cuisine || "",
      description: admin?.description || "",
      phoneNumber: admin?.phoneNumber || "",
      address: admin?.address || "",
      latitude: admin?.latitude || 0,
      longitude: admin?.longitude || 0,
      coverImage: undefined,
    },
  });

  useEffect(() => {
    form.setValue("deliveryTime", admin?.deliveryTime);
    form.setValue("cuisine", admin?.cuisine);
    form.setValue("description", admin?.description);
    form.setValue("phoneNumber", admin?.phoneNumber);
    form.setValue("address", admin?.address);
    form.setValue("latitude", admin?.latitude);
    form.setValue("longitude", admin?.longitude);
  }, [
    admin?.address,
    admin?.coverImage,
    admin?.cuisine,
    admin?.deliveryTime,
    admin?.description,
    admin?.phoneNumber,
    admin?.latitude,
    admin?.longitude,
    form,
  ]);

  const { mutate: completeInfoMutation, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof storeInfoValidationSchema>) => {
      await completeStoreInfo(data, token);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Profile updated successfully",
        variant: "default",
      });

      queryClient.invalidateQueries({ queryKey: ["admin-status"] });

      navigate("/");
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: z.infer<typeof storeInfoValidationSchema>) => {
    completeInfoMutation(data);
  };

  return (
    <section className="w-full flex flex-col items-center justify-center gap-y-8 px-4 pt-12">
      <div className="flex flex-col gap-y-4 items-center justify-center">
        <h2 className="text-gray-950 font-semibold text-2xl sm:text-3xl">
          Complete your profile
        </h2>
        <div className="w-28 h-px bg-black/15" />
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="w-1/2 space-y-3"
        >
          {admin?.isEmailVerified ? (
            <div className="w-fit rounded-full flex items-center gap-x-1.5 px-2 py-1 bg-blue-600/25">
              <span className="rounded-full p-0.5 bg-blue-800">
                <Check size={12} className="text-white" />
              </span>

              <p className="text-xs font-medium text-blue-800">Verified</p>
            </div>
          ) : (
            <HandleEmailVerification
              name={admin?.name}
              email={admin?.email}
              token={token}
            />
          )}
          <div className="grid grid-cols-2 gap-3">
            <FormField
              name="deliveryTime"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery time</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Delivery time"
                      disabled={!!admin?.deliveryTime}
                      className="w-full border-black/15 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary/70 outline-none font-medium transition-all disabled:opacity-100 disabled:border-primary/70"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="cuisine"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cuisine</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="cuisine"
                      disabled={!!admin?.cuisine}
                      className="w-full border-black/15 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary/70 outline-none font-medium transition-all disabled:opacity-100 disabled:border-primary/70"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    rows={5}
                    disabled={!!admin?.description}
                    style={{ resize: "none" }}
                    placeholder="description"
                    className="w-full border-black/15 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary/70 outline-none font-medium transition-all disabled:opacity-100 disabled:border-primary/70"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="address"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="address"
                    disabled={!!admin?.address}
                    className="w-full border-black/15 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary/70 outline-none font-medium transition-all disabled:opacity-100 disabled:border-primary/70"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-3">
            <FormField
              name="latitude"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Latitude</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="latitude"
                      step={0.0001}
                      disabled={!!admin?.latitude}
                      className="w-full border-black/15 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary/70 outline-none font-medium transition-all disabled:opacity-100 disabled:border-primary/70"
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(parseFloat(e.target.value));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="longitude"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Longitude</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="longitude"
                      step={0.0001}
                      disabled={!!admin?.longitude}
                      className="w-full border-black/15 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary/70 outline-none font-medium transition-all disabled:opacity-100 disabled:border-primary/70"
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(parseFloat(e.target.value));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            name="phoneNumber"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="phone number"
                    disabled={!!admin?.phoneNumber}
                    className="w-full border-black/15 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary/70 outline-none font-medium transition-all disabled:opacity-100 disabled:border-primary/70"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="coverImage"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cover Image</FormLabel>
                {admin?.coverImage ? (
                  <RenderImage token={token} />
                ) : (
                  <FormControl>
                    <HandleImageChange fieldChange={field.onChange} />
                  </FormControl>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isPending}
            className="w-full text-base"
          >
            {isPending ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              "Save and continue"
            )}
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default CompleteInfo;
