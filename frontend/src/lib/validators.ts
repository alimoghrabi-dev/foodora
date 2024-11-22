import * as z from "zod";

export const signUpValidationShcema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    nickname: z.string().optional(),
    email: z.string(),
    phoneNumber: z.string().min(1, { message: "Phone number is required" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginValidationSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const editProfileValidationSchema = z.object({
  name: z.string().optional(),
  nickname: z.string().optional(),
  dateOfBirth: z.string().optional(),
  phoneNumber: z.string().optional(),
});

export const passwordChangeValidationSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "Current password is required" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const applyFormValidationSchema = z.object({
  restaurantName: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  description: z.string().min(1, { message: "Description is required" }),
  phoneNumber: z.string().min(1, { message: "Phone number is required" }),
  address: z.string().min(1, { message: "Address is required" }),
});

export const driverApplyFormValidationSchema = z.object({
  driverName: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  phoneNumber: z.string().min(1, { message: "Phone number is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  licenseNumber: z.string().min(1, { message: "License number is required" }),
  vehicleType: z.string().min(1, { message: "Vehicle type is required" }),
  vehicleNumber: z.string().min(1, { message: "Vehicle number is required" }),
  licenseType: z.string().min(1, { message: "License type is required" }),
});

export const restaurantRegistrationValidationSchema = z
  .object({
    restaurantName: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Please enter a valid email" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
    phoneNumber: z.string().min(1, { message: "Phone number is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
