import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Restaurant from "../models/restaurants.model.js";
export const generateToken = (id) => {
    const payload = { id };
    const secret = process.env.JWT_SECRET;
    const options = {
        expiresIn: "15d",
    };
    const token = jwt.sign(payload, secret, options);
    return token;
};
export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: missing token" });
    }
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);
    if (!decoded) {
        return res.status(401).json({ message: "Unauthorized: invalid token" });
    }
    const userId = decoded.id;
    req.userId = userId;
    next();
};
export const verifyIfUserAdmin = async (req, res, next) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!user.isAdmin) {
            return res
                .status(403)
                .json({ message: "You dont have access for this action." });
        }
        next();
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Internal Server Error", cause: error });
    }
};
export const verifyRestaurantRegistrationToken = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "missing token" });
        }
        const secret = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, secret);
        if (!decoded) {
            return res.status(401).json({ message: "invalid token" });
        }
        const restaurantEmail = decoded.email;
        const existingRes = await Restaurant.findOne({ email: restaurantEmail });
        return res
            .status(200)
            .json({ restaurantEmail, token, isExisting: !!existingRes });
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Internal Server Error", cause: error });
    }
};
export const verifyRestaurantRegistrationTokenCreateRoute = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "missing token" });
        }
        const secret = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, secret);
        if (!decoded) {
            return res.status(401).json({ message: "invalid token" });
        }
        const restaurantEmail = decoded.email;
        req.restaurantEmail = restaurantEmail;
        next();
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Internal Server Error", cause: error });
    }
};
export const verifyEmailVerificationToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: missing token" });
    }
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret);
    if (!decoded) {
        return res.status(401).json({ message: "Unauthorized: invalid token" });
    }
    const userId = decoded.id;
    req.userId = userId;
    next();
};
//# sourceMappingURL=token.js.map