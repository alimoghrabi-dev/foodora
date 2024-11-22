import { Schema, Document, model } from "mongoose";

export interface IItem extends Document {
  name: string;
  description: string;
  restaurantId: Schema.Types.ObjectId;
  price: number;
  category: Schema.Types.ObjectId;
  coverImage: string;
  imageUrl: string;
  isOutOfStock: boolean;
}

const ItemSchema = new Schema<IItem>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    coverImage: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    isOutOfStock: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Item = model("Item", ItemSchema);

export default Item;
