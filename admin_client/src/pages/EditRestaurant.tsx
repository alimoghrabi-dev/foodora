import React, { useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import HandleImageChange from "../components/shared/HandleImageChange";
import { Button } from "../components/ui/button";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { editStoreInfoValidationSchema } from "../lib/validators";
import { useAuth } from "../context/useAuth";
import { useMutation } from "@tanstack/react-query";
import { editRestaurantInfo } from "../lib/actions";
import { useToast } from "../components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const EditRestaurant: React.FC = () => {
  const { admin, token } = useAuth();
  const { toast } = useToast();

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof editStoreInfoValidationSchema>>({
    resolver: zodResolver(editStoreInfoValidationSchema),
    defaultValues: {
      deliveryTime: admin?.deliveryTime || "",
      cuisine: admin?.cuisine || "",
      description: admin?.description || "",
      phoneNumber: admin?.phoneNumber || "",
      coverImage: undefined,
    },
  });

  useEffect(() => {
    form.setValue("deliveryTime", admin?.deliveryTime);
    form.setValue("cuisine", admin?.cuisine);
    form.setValue("description", admin?.description);
    form.setValue("phoneNumber", admin?.phoneNumber);
  }, [
    admin?.coverImage,
    admin?.cuisine,
    admin?.deliveryTime,
    admin?.description,
    admin?.phoneNumber,
    form,
  ]);

  const { mutate: editStoreMutation, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof editStoreInfoValidationSchema>) => {
      await editRestaurantInfo(data, token);
    },
    onSuccess: () => {
      toast({
        title: "Store updated successfully",
        variant: "default",
      });

      navigate("/");
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (
    data: z.infer<typeof editStoreInfoValidationSchema>
  ) => {
    editStoreMutation(data);
  };

  return (
    <section className="w-full flex flex-col items-center justify-center gap-y-8 px-4 pt-12">
      <div className="flex flex-col gap-y-4 items-center justify-center">
        <h2 className="text-gray-950 font-semibold text-2xl sm:text-3xl">
          Edit your Store
        </h2>
        <div className="w-28 h-px bg-black/15" />
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="w-1/2 space-y-3"
        >
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
            name="phoneNumber"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="phone number"
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
                <FormLabel className="flex items-center gap-x-1.5 font-semibold text-gray-950">
                  Display Image <span className="text-primary">*</span>
                </FormLabel>
                <FormControl>
                  <HandleImageChange
                    fieldChange={field.onChange}
                    fieldValue={admin?.imageUrl}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isPending || !form.formState.isDirty}
            className="w-full text-base"
          >
            {isPending ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              "Complete"
            )}
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default EditRestaurant;
