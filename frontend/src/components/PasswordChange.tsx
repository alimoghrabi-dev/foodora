import React from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { passwordChangeValidationSchema } from "../lib/validators";
import { Button } from "./ui/button";
import { useAuth } from "../context/UseAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { changePassword } from "../lib/actions";
import { useToast } from "./ui/use-toast";

const PasswordChange: React.FC = () => {
  const { token } = useAuth();
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof passwordChangeValidationSchema>>({
    resolver: zodResolver(passwordChangeValidationSchema),
    defaultValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  const {
    mutate: changePasswordMutation,
    isError,
    error,
    isPending,
  } = useMutation({
    mutationFn: async (
      data: z.infer<typeof passwordChangeValidationSchema>
    ) => {
      await changePassword(data, token);
    },
    onSuccess: () => {
      toast({
        description: "Password changed successfully",
        className:
          "bg-green-500 text-white text-3xl font-semibold ring-0 border-none",
      });

      queryClient.invalidateQueries({ queryKey: ["auth-status"] });

      form.reset();
    },
  });

  const onSubmit = (data: z.infer<typeof passwordChangeValidationSchema>) => {
    changePasswordMutation(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-2.5"
      >
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Current Password"
                  className="w-full border-black/15 focus-visible:border-primary outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-all"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="password"
                  placeholder="New Password"
                  className="w-full border-black/15 focus-visible:border-primary outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-all"
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
              <FormControl>
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full border-black/15 focus-visible:border-primary outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-all"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {isError && (
          <p className="text-red-500 text-sm font-semibold">
            {error.message === "Request failed with status code 400"
              ? "Current password is incorrect"
              : "Passwords do not match"}
          </p>
        )}
        <Button
          type="submit"
          disabled={
            isPending ||
            !form.watch("currentPassword") ||
            !form.watch("password") ||
            !form.watch("confirmPassword")
          }
          className="rounded-lg font-semibold disabled:bg-neutral-600/75"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
        </Button>
      </form>
    </Form>
  );
};

export default PasswordChange;
