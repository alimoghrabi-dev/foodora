import React, { useEffect, useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { editProfileValidationSchema } from "../lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { useAuth } from "../context/UseAuth";
import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editUserProfile } from "../lib/actions";
import { useToast } from "./ui/use-toast";
import { Loader2 } from "lucide-react";
import { formatDate } from "../lib/utils";

const EditProfileCredentialsForm: React.FC = () => {
  const { token, user } = useAuth();
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

  const form = useForm<z.infer<typeof editProfileValidationSchema>>({
    resolver: zodResolver(editProfileValidationSchema),
    defaultValues: {
      name: user?.name || "",
      nickname: user?.nickname || "",
      dateOfBirth: user?.dateOfBirth ? formatDate(user?.dateOfBirth) : "",
      phoneNumber: user?.phoneNumber || "",
    },
  });

  useEffect(() => {
    form.setValue("name", user?.name || "");
    form.setValue("nickname", user?.nickname || "");
    form.setValue(
      "dateOfBirth",
      user?.dateOfBirth ? formatDate(user.dateOfBirth) : ""
    );
    form.setValue("phoneNumber", user?.phoneNumber || "");
  }, [user, form]);

  const { mutate: editProfile, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof editProfileValidationSchema>) => {
      await editUserProfile(data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-status"] });

      form.reset();

      toast({
        title: "Profile updated successfully",
        description: "Your profile has been updated successfully",
        className:
          "bg-green-500 text-white text-3xl font-semibold ring-0 border-none",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof editProfileValidationSchema>) => {
    editProfile(data);
  };

  useEffect(() => {
    const subscription = form.watch(() => {
      const values = form.getValues();
      const hasChanges =
        values.name !== user?.name ||
        values.nickname !== user?.nickname ||
        values.dateOfBirth !== user?.dateOfBirth ||
        values.phoneNumber !== user?.phoneNumber;

      const allFieldsFilled =
        values.name !== "" ||
        values.nickname !== "" ||
        values.dateOfBirth !== "" ||
        values.phoneNumber !== "";

      setIsButtonDisabled(!hasChanges || !allFieldsFilled);
    });
    return () => subscription.unsubscribe();
  }, [form, user]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-2.5"
      >
        <FormField
          control={form.control}
          name={"name"}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Name</FormLabel>
              <FormControl className="w-full">
                <Input
                  placeholder="your name"
                  className="w-full border-black/15 focus-visible:border-primary outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-all"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"nickname"}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Nickname</FormLabel>
              <FormControl className="w-full">
                <Input
                  placeholder="your nickname"
                  className="w-full border-black/15 focus-visible:border-primary outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-all"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"dateOfBirth"}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Date of Birth</FormLabel>
              <FormControl className="w-full">
                <Input
                  type="date"
                  placeholder="your date of birth"
                  className="w-full border-black/15 focus-visible:border-primary outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-all"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"phoneNumber"}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Phone Number</FormLabel>
              <FormControl className="w-full">
                <Input
                  placeholder="your phone number"
                  className="w-full border-black/15 focus-visible:border-primary outline-none focus-visible:ring-0 focus-visible:ring-offset-0 transition-all"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isButtonDisabled || isPending}
          className="rounded-lg font-semibold disabled:bg-neutral-600/75"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
        </Button>
      </form>
    </Form>
  );
};

export default EditProfileCredentialsForm;
