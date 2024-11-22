import { ChevronLeft, Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { editItemValidationSchema } from "../lib/validators";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import HandleImageChange from "../components/shared/HandleImageChange";
import { ComboboxDemo } from "../components/ui/Combobox";
import { Button } from "../components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../components/ui/use-toast";
import { useAuth } from "../context/useAuth";
import { editItem, getItemById, getRestaurantCategories } from "../lib/actions";
import { Checkbox } from "../components/ui/checkbox";

const EditMenuItem: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();

  const { token } = useAuth();
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => {
      return getRestaurantCategories(token);
    },
  });

  const { data: item, isPending: isLoadingItem } = useQuery({
    queryKey: ["item-by-id"],
    queryFn: () => {
      return getItemById(params.id, token);
    },
  });

  const form = useForm<z.infer<typeof editItemValidationSchema>>({
    resolver: zodResolver(editItemValidationSchema),
    defaultValues: {
      name: item?.name || "",
      description: item?.description || "",
      price: item?.price || 0,
      image: item?.imageUrl,
      category: item?.category?.name || "",
      isOutOfStock: item?.isOutOfStock || false,
    },
  });

  useEffect(() => {
    form.setValue("name", item?.name || "");
    form.setValue("description", item?.description || "");
    form.setValue("price", item?.price || 0);
    form.setValue("image", item?.imageUrl);
    form.setValue("category", item?.category?.name || "");
    form.setValue("isOutOfStock", item?.isOutOfStock || "");
  }, [
    form,
    item?.category?.name,
    item?.description,
    item?.imageUrl,
    item?.name,
    item?.price,
    item?.isOutOfStock,
  ]);

  const { mutate: editItemMutation, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof editItemValidationSchema>) => {
      await editItem(data, item?._id, token);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Item updated successfully",
        variant: "default",
      });

      queryClient.invalidateQueries({ queryKey: ["menu-items"] });

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

  const handleSubmit = (data: z.infer<typeof editItemValidationSchema>) => {
    editItemMutation(data);
  };

  if (isLoadingItem) {
    return (
      <div className="w-full flex items-center justify-center pt-24">
        <Loader2 size={78} className="animate-spin text-primary" />
      </div>
    );
  }

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
          Edit {item?.name}
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
                  <HandleImageChange
                    fieldChange={field.onChange}
                    fieldValue={item?.imageUrl}
                  />
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
                    fieldValue={item?.category?.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="isOutOfStock"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="items-top flex space-x-2">
                    <Checkbox
                      id="terms1"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="terms1"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Make this item out of stock
                      </label>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              "Edit Menu Item"
            )}
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default EditMenuItem;
