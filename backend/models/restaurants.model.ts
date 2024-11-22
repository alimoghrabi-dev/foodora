import { Schema, Document, model } from "mongoose";
import { IOpeningHours } from "../types/express.js";

const openingHoursSchema = new Schema<IOpeningHours>({
  monday: {
    opening: { type: String },
    closing: { type: String },
  },
  tuesday: {
    opening: { type: String },
    closing: { type: String },
  },
  wednesday: {
    opening: { type: String },
    closing: { type: String },
  },
  thursday: {
    opening: { type: String },
    closing: { type: String },
  },
  friday: {
    opening: { type: String },
    closing: { type: String },
  },
  saturday: {
    opening: { type: String },
    closing: { type: String },
  },
  sunday: {
    opening: { type: String },
    closing: { type: String },
  },
});

export interface IRestaurant extends Document {
  name: string;
  email: string;
  description: string;
  isEmailVerified: boolean;
  password: string;
  address: string;
  latitude: number;
  longitude: number;
  phoneNumber: string;
  openingHours: IOpeningHours;
  deliveryTime: string;
  cuisine: string;
  coverImage: string;
  imageUrl: string;
  rating: number;
  isOnSale: boolean;
  salePercentage: number;
  isPublished: boolean;
  isClosed: boolean;
  isTimeout: boolean;
}

const RestaurantSchema = new Schema<IRestaurant>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    openingHours: {
      type: openingHoursSchema,
    },
    deliveryTime: {
      type: String,
    },
    cuisine: {
      type: String,
    },
    description: {
      type: String,
    },
    coverImage: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    rating: {
      type: Number,
    },
    isOnSale: {
      type: Boolean,
      default: false,
    },
    salePercentage: {
      type: Number,
      max: 100,
      min: 1,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    isClosed: {
      type: Boolean,
      default: false,
    },
    isTimeout: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

const Restaurant = model("Restaurant", RestaurantSchema);

export default Restaurant;
