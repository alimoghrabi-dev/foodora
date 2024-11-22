import { Request } from "express";

interface DecodedToken {
  id?: string;
  email?: string;
}

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
    restaurantEmail?: string;
  }
}

interface PopulatedItem extends Document {
  coverImage: string;
  imageUrl?: string;
}

interface IOpeningHours {
  monday: { opening: string; closing: string };
  tuesday: { opening: string; closing: string };
  wednesday: { opening: string; closing: string };
  thursday: { opening: string; closing: string };
  friday: { opening: string; closing: string };
  saturday: { opening: string; closing: string };
  sunday: { opening: string; closing: string };
}
