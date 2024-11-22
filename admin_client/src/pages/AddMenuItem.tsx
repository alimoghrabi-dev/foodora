import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { addItemValidationSchema } from "../lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useMutation, useQuery } from "@tanstack/react-query";
import { addNewItem, getRestaurantCategories } from "../lib/actions";
import { useAuth } from "../context/useAuth";
import { ChevronLeft, Loader2 } from "lucide-react";
import { ComboboxDemo } from "../components/ui/Combobox";
import { useToast } from "../components/ui/use-toast";
import { Link, useNavigate } from "react-router-dom";

const AddMenuItem: React.FC = () => {
  const { token } = useAuth();
  const { toast } = useToast();

  const navigate = useNavigate();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => {
      return getRestaurantCategories(token);
    },
  });

  const form = useForm<z.infer<typeof addItemValidationSchema>>({
    resolver: zodResolver(addItemValidationSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      image: undefined,
      category: "",
    },
  });

  const { mutate: addItemMutation, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof addItemValidationSchema>) => {
      await addNewItem(data, token);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Item added successfully",
        variant: "default",
      });

      navigate("/menu");
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

  const handleSubmit = (data: z.infer<typeof addItemValidationSchema>) => {
    addItemMutation(data);
  };

  return (
    <section className="w-full relative flex flex-col items-center justify-center gap-y-8 pt-12">
      <Link
        to="/menu"
        className="p-1 absolute top-5 left-4 rounded-full border border-black/50 hover:opacity-60 cursor-pointer transition-all"
      >
        <ChevronLeft size={24} />
      </Link>

      <div className="flex flex-col items-center gap-y-4">
        <h2 className="text-gray-950 font-semibold text-3xl">
          Add New Menu Item
        </h2>
        <div className="w-28 h-px bg-black/15" />
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="w-1/2 space-y-4"
        >
          <div className="w-full grid grid-cols-2 gap-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-x-1.5 font-semibold text-gray-950">
                    Name <span className="text-primary">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="name of your item"
                      className="w-full border-black/15 focus-visible:ring-0 outline-none focus-visible:ring-offset-0 focus-visible:border-primary font-medium transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="price"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-x-1.5 font-semibold text-gray-950">
                    Price <span className="text-primary">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="price of your item"
                      className="w-full border-black/15 focus-visible:ring-0 outline-none focus-visible:ring-offset-0 focus-visible:border-primary font-medium transition-all"
                      value={field.value}
                      onChange={(e) => {
                        if (parseFloat(e.target.value) < 0) {
                          return;
                        }
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
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-x-1.5 font-semibold text-gray-950">
                  Description <span className="text-primary">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="description of your item"
                    rows={4}
                    style={{ resize: "none" }}
                    className="w-full border-black/15 focus-visible:ring-0 outline-none focus-visible:ring-offset-0 focus-visible:border-primary font-medium transition-all"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="image"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-x-1.5 font-semibold text-gray-950">
                  Display Image <span className="text-primary">*</span>
                </FormLabel>
                <FormControl>
                  <HandleImageChange fieldChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="category"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-x-1.5 font-semibold text-gray-950">
                  Category <span className="text-primary">*</span>
                </FormLabel>
                <FormControl>
                  <ComboboxDemo
                    categories={categories}
                    fieldChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              "Add New Menu Item"
            )}
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default AddMenuItem;
