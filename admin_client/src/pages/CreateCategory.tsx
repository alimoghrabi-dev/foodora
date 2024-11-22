import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CreateCategoryValidationSchema } from "../lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { createNewCategory } from "../lib/actions";
import { useAuth } from "../context/useAuth";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useToast } from "../components/ui/use-toast";
import { Link, useNavigate } from "react-router-dom";

const CreateCategory: React.FC = () => {
  const { token } = useAuth();
  const { toast } = useToast();

  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof CreateCategoryValidationSchema>>({
    resolver: zodResolver(CreateCategoryValidationSchema),
    defaultValues: {
      name: "",
    },
  });

  const { mutate, isPending: isCreating } = useMutation({
    mutationFn: async (
      data: z.infer<typeof CreateCategoryValidationSchema>
    ) => {
      await createNewCategory(data.name, token);
    },
    onSuccess: () => {
      toast({
        title: "Category created",
        description: "Category created successfully",
        variant: "default",
      });

      navigate("/menu");
      form.reset();
    },
    onError: (error) => {
      if (error.message === "Request failed with status code 409") {
        setErrorMessage("Category already exists");
      } else {
        setErrorMessage("Something went wrong");
      }
    },
  });

  const handleSubmit = (
    data: z.infer<typeof CreateCategoryValidationSchema>
  ) => {
    mutate(data);
  };

  return (
    <section className="w-full relative flex items-center justify-center pt-12">
      <Link
        to="/menu"
        className="p-1 absolute top-5 left-4 rounded-full border border-black/50 hover:opacity-60 cursor-pointer transition-all"
      >
        <ChevronLeft size={24} />
      </Link>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="w-1/2 space-y-4"
        >
          <div className="flex flex-col items-center justify-center gap-y-3">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-950">
              Create Category
            </h2>
            <div className="w-28 h-px bg-black/15" />
          </div>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Name <span className="text-primary">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="category name"
                    className="border-black/25 w-full outline-none font-medium focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-black/75 transition-all"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {errorMessage && (
            <p className="text-sm font-medium text-red-500 text-center">
              {errorMessage}
            </p>
          )}
          <Button disabled={isCreating} className="w-full" type="submit">
            {isCreating ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              "Create"
            )}
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default CreateCategory;
