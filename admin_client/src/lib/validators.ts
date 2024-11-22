import { z } from "zod";

export const loginValidatorSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const addItemValidationSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  price: z.number().min(0.1, { message: "Price is required" }),
  image: z.instanceof(File, { message: "Image is required" }).refine(
    (file) => {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

      return allowedTypes.includes(file.type);
    },
    {
      message: "Invalid file type. Only JPEG, PNG files are allowed.",
    }
  ),
  category: z.string().min(1, { message: "Category is required" }),
});

export const CreateCategoryValidationSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});

export const editItemValidationSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.number().min(0.1).optional(),
  image: z.any().optional(),
  category: z.string().optional(),
  isOutOfStock: z.boolean().optional(),
});

export const storeInfoValidationSchema = z.object({
  deliveryTime: z.string().optional(),
  cuisine: z.string().optional(),
  description: z.string().optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  latitude: z.number().step(0.0001).min(-90).max(90).optional(),
  longitude: z.number().step(0.0001).min(-180).max(180).optional(),
  coverImage: z
    .instanceof(File, { message: "Image is required" })
    .optional()
    .refine(
      (file) => {
        if (file) {
          const allowedTypes = ["image/jpeg", "image/png"];
          return allowedTypes.includes(file?.type);
        }

        return;
      },
      {
        message: "Invalid file type. Only JPEG, PNG files are allowed.",
      }
    )
    .optional(),
});

export const editStoreInfoValidationSchema = z.object({
  deliveryTime: z.string().optional(),
  cuisine: z.string().optional(),
  description: z.string().optional(),
  phoneNumber: z.string().optional(),
  coverImage: z
    .instanceof(File, { message: "Image is required" })
    .optional()
    .refine(
      (file) => {
        if (file) {
          const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

          return allowedTypes.includes(file?.type);
        }

        return;
      },
      {
        message: "Invalid file type. Only JPEG, PNG files are allowed.",
      }
    )
    .optional(),
});
