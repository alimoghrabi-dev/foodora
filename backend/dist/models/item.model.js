import { Schema, model } from "mongoose";
const ItemSchema = new Schema({
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
}, { timestamps: true });
const Item = model("Item", ItemSchema);
export default Item;
//# sourceMappingURL=item.model.js.map