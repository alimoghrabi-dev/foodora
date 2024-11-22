import Restaurant from "../models/restaurants.model.js";
import { generateToken } from "../utils/token.js";
import bcrypt from "bcrypt";
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const restaurant = await Restaurant.findOne({ email });
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        const isPasswordValid = await bcrypt.compare(password, restaurant.password || "");
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Password is invalid" });
        }
        const token = generateToken(restaurant._id);
        return res.status(200).json({
            message: "Admin logged in successfully",
            token,
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Internal Server Error", cause: error });
    }
};
export const verifyAdmin = async (req, res) => {
    try {
        const restaurantId = req.userId;
        if (!restaurantId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const restaurant = await Restaurant.findById(restaurantId).select("-password");
        return res.status(200).json(restaurant);
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            cause: error,
        });
    }
};
//# sourceMappingURL=admin.controllers.js.map