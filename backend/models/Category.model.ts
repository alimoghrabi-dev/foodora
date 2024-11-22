import { Schema, Document, model } from "mongoose";

export interface ICategory extends Document {
  name: string;
  restaurantId: Schema.Types.ObjectId;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
    },
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
    },
  },
  { timestamps: true }
);

const Category = model("Category", CategorySchema);

export default Category;
