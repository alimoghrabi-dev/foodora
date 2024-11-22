import { Schema, model } from "mongoose";
const CategorySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    restaurantId: {
        type: Schema.Types.ObjectId,
        ref: "Restaurant",
    },
}, { timestamps: true });
const Category = model("Category", CategorySchema);
export default Category;
//# sourceMappingURL=Category.model.js.map