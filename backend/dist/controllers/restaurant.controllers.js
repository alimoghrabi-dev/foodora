import bcrypt from "bcrypt";
import Restaurant from "../models/restaurants.model.js";
import jwt from "jsonwebtoken";
import Item from "../models/item.model.js";
import { GetObjectCommand, PutObjectCommand, DeleteObjectCommand, } from "@aws-sdk/client-s3";
import { s3 } from "../utils/s3.js";
import { randomName } from "../utils/validators.js";
import Category from "../models/Category.model.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import sharp from "sharp";
import Order from "../models/order.mdoel.js";
export const createNewRestaurant = async (req, res) => {
    try {
        const { restaurantName, phoneNumber, password, confirmPassword } = req.body;
        const email = req.restaurantEmail;
        if (!restaurantName || !phoneNumber || !password || !confirmPassword) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }
        const existingRestaurant = await Restaurant.findOne({ email });
        const existingRestaurantName = await Restaurant.findOne({ restaurantName });
        if (existingRestaurant || existingRestaurantName) {
            return res.status(409).json({
                message: "Restaurant already exists",
            });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match",
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newRestaurant = new Restaurant({
            name: restaurantName,
            phoneNumber,
            email,
            password: hashedPassword,
        });
        await newRestaurant.save();
        return res.status(201).json({
            message: "Restaurant created successfully",
            success: true,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            cause: error,
        });
    }
};
export const loginRestaurant = async (req, res) => {
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
        const payload = { id: restaurant._id };
        const secret = process.env.JWT_SECRET;
        const options = {
            expiresIn: "15d",
        };
        const token = jwt.sign(payload, secret, options);
        return res.status(200).json({
            message: "Restaurant logged in successfully",
            token,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            cause: error,
        });
    }
};
export const verifyRestaurant = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const restaurant = await Restaurant.findById(userId).select("-password");
        return res.status(200).json(restaurant);
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            cause: error,
        });
    }
};
export const getRestaurantMenuItems = async (req, res) => {
    try {
        const restaurantId = req.userId;
        const items = await Item.find({ restaurantId })
            .populate("category")
            .sort({ _id: -1 });
        for (const item of items) {
            const getObjectParams = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: item.coverImage,
            };
            const command = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
            item.imageUrl = url;
            await item.save();
        }
        return res.status(200).json(items);
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            cause: error,
        });
    }
};
export const addNewItem = async (req, res) => {
    try {
        const { name, price, description, category } = req.body;
        const restaurantId = req.userId;
        const buffer = await sharp(req.file?.buffer)
            .resize({
            width: 550,
            height: 350,
        })
            .jpeg()
            .toBuffer();
        const randomGeneratedName = randomName();
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: randomGeneratedName,
            Body: buffer,
            ContentType: req.file?.mimetype,
        };
        const command = new PutObjectCommand(params);
        await s3.send(command);
        const categoryModel = await Category.findOne({
            name: category,
            restaurantId,
        });
        if (!categoryModel) {
            return res.status(404).json("Category not found");
        }
        const newItem = new Item({
            name,
            price,
            description,
            coverImage: randomGeneratedName,
            category: categoryModel._id,
            restaurantId,
        });
        await newItem.save();
        return res.status(200).json("Item added successfully");
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            cause: error,
        });
    }
};
export const createNewCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const restaurantId = req.userId;
        const existingRestaurantCategory = await Category.findOne({
            name,
            restaurantId,
        });
        if (existingRestaurantCategory) {
            return res.status(409).json("Category already exists");
        }
        await Category.create({
            name,
            restaurantId: restaurantId,
        });
        return res.status(201).json("Category created successfully");
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            cause: error,
        });
    }
};
export const getRestaurantCategories = async (req, res) => {
    try {
        const restaurantId = req.userId;
        const categories = await Category.find({ restaurantId });
        return res.status(200).json(categories);
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            cause: error,
        });
    }
};
export const editMenuItem = async (req, res) => {
    try {
        const { id: itemId } = req.params;
        const { name, price, description, category, isOutOfStock } = req.body;
        const restaurantId = req.userId;
        const item = await Item.findById(itemId);
        if (!item || item?.restaurantId.toString() !== restaurantId) {
            return res.status(404).json("Item not found");
        }
        if (name) {
            item.name = name;
        }
        if (price) {
            item.price = price;
        }
        if (description) {
            item.description = description;
        }
        if (category) {
            const categoryModel = await Category.findOne({
                name: category,
                restaurantId: item.restaurantId,
            });
            if (!categoryModel) {
                return res.status(404).json("Category not found");
            }
            await Item.findByIdAndUpdate(itemId, {
                category: categoryModel._id,
            });
        }
        if (isOutOfStock) {
            item.isOutOfStock = isOutOfStock;
        }
        if (req.file) {
            const oldImageKey = item.coverImage;
            const deleteParams = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: oldImageKey,
            };
            const deleteCommand = new DeleteObjectCommand(deleteParams);
            await s3.send(deleteCommand);
            const buffer = await sharp(req.file.buffer)
                .resize({ width: 550, height: 350 })
                .jpeg()
                .toBuffer();
            const randomGeneratedName = randomName();
            const params = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: randomGeneratedName,
                Body: buffer,
                ContentType: req.file?.mimetype,
            };
            const command = new PutObjectCommand(params);
            await s3.send(command);
            item.coverImage = randomGeneratedName;
        }
        await item.save();
        return res.status(200).json("Item updated successfully");
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            cause: error.message,
        });
    }
};
export const getItemById = async (req, res) => {
    try {
        const { itemId } = req.body;
        const restaurantId = req.userId;
        const item = await Item.findById(itemId).populate("category");
        if (!item) {
            return res.status(404).json("Item not found");
        }
        if (item?.restaurantId.toString() !== restaurantId) {
            return res
                .status(404)
                .json("You don't have permission to access this item");
        }
        const getObjectParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: item.coverImage,
        };
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        item.imageUrl = url;
        return res.status(200).json(item);
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            cause: error,
        });
    }
};
export const completeInfo = async (req, res) => {
    try {
        const { deliveryTime, cuisine, description, phoneNumber, address, latitude, longitude, } = req.body;
        const restaurantId = req.userId;
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json("Restaurant not found");
        }
        if (deliveryTime && !restaurant.deliveryTime) {
            restaurant.deliveryTime = deliveryTime;
        }
        if (cuisine && !restaurant.cuisine) {
            restaurant.cuisine = cuisine;
        }
        if (description && !restaurant.description) {
            restaurant.description = description;
        }
        if (phoneNumber && !restaurant.phoneNumber) {
            restaurant.phoneNumber = phoneNumber;
        }
        if (address && !restaurant.address) {
            restaurant.address = address;
        }
        if (latitude && !restaurant.latitude) {
            restaurant.latitude = latitude;
        }
        if (longitude && !restaurant.longitude) {
            restaurant.longitude = longitude;
        }
        if (req.file && !restaurant.coverImage) {
            const buffer = await sharp(req.file.buffer)
                .resize({ width: 550, height: 350 })
                .jpeg()
                .toBuffer();
            const randomGeneratedName = randomName();
            const params = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: randomGeneratedName,
                Body: buffer,
                ContentType: req.file?.mimetype,
            };
            const command = new PutObjectCommand(params);
            await s3.send(command);
            restaurant.coverImage = randomGeneratedName;
        }
        await restaurant.save();
        return res.status(200).json("Info updated successfully");
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            cause: error,
        });
    }
};
export const renderImage = async (req, res) => {
    try {
        const restaurantId = req.userId;
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json("Restaurant not found");
        }
        const getObjectParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: restaurant.coverImage,
        };
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        restaurant.imageUrl = url;
        await restaurant.save();
        return res.status(200).json({ image: restaurant.imageUrl });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            cause: error,
        });
    }
};
export const creatingVerificationLink = async (req, res) => {
    try {
        const restaurantId = req.userId;
        const verificationToken = jwt.sign({ id: restaurantId }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        return res.status(200).json(verificationToken);
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            cause: error,
        });
    }
};
export const verifyEmail = async (req, res) => {
    try {
        const restaurantId = req.userId;
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json("Restaurant not found");
        }
        restaurant.isEmailVerified = true;
        await restaurant.save();
        return res.status(200).json("Email verified successfully");
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            cause: error,
        });
    }
};
export const publishStore = async (req, res) => {
    try {
        const restaurantId = req.userId;
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json("Restaurant not found");
        }
        restaurant.isPublished = true;
        await restaurant.save();
        return res.status(200).json("Published successfully");
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            cause: error,
        });
    }
};
export const applyDiscount = async (req, res) => {
    try {
        const { percentage } = req.body;
        const restaurantId = req.userId;
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json("Restaurant not found");
        }
        await Restaurant.findByIdAndUpdate(restaurant._id, {
            $set: {
                isOnSale: true,
                salePercentage: percentage,
            },
        });
        return res.status(200).json("Discount applied successfully.");
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            cause: error,
        });
    }
};
export const removeDiscount = async (req, res) => {
    try {
        const restaurantId = req.userId;
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json("Restaurant not found");
        }
        await Restaurant.findByIdAndUpdate(restaurant._id, {
            $set: {
                isOnSale: false,
                salePercentage: null,
            },
        });
        return res.status(200).json("Discount removed successfully.");
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            cause: error,
        });
    }
};
export const editRestaurantInfo = async (req, res) => {
    try {
        const restaurantId = req.userId;
        const { cuisine, deliveryTime, description, phoneNumber } = req.body;
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json("Restaurant not found");
        }
        if (cuisine && restaurant.cuisine !== cuisine) {
            restaurant.cuisine = cuisine;
        }
        if (deliveryTime && restaurant.deliveryTime !== deliveryTime) {
            restaurant.deliveryTime = deliveryTime;
        }
        if (description && restaurant.description !== description) {
            restaurant.description = description;
        }
        if (phoneNumber && restaurant.phoneNumber !== phoneNumber) {
            restaurant.phoneNumber = phoneNumber;
        }
        if (req.file) {
            const oldImageKey = restaurant.coverImage;
            const deleteParams = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: oldImageKey,
            };
            const deleteCommand = new DeleteObjectCommand(deleteParams);
            await s3.send(deleteCommand);
            const buffer = await sharp(req.file.buffer)
                .resize({ width: 550, height: 350 })
                .jpeg()
                .toBuffer();
            const randomGeneratedName = randomName();
            const params = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: randomGeneratedName,
                Body: buffer,
                ContentType: req.file?.mimetype,
            };
            const command = new PutObjectCommand(params);
            await s3.send(command);
            restaurant.coverImage = randomGeneratedName;
        }
        await restaurant.save();
        return res.status(200).json("Restaurant info updated successfully.");
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            cause: error,
        });
    }
};
export const getRestaurantOrders = async (req, res) => {
    try {
        const restaurantId = req.userId;
        const orders = await Order.find({
            restaurantId,
            orderStatus: { $ne: "delivered" },
        })
            .populate("userId")
            .sort({ createdAt: -1 });
        const pendingOrdersLength = await Order.find({
            restaurantId,
            orderStatus: "pending",
        }).countDocuments();
        const acceptedOrdersLength = await Order.find({
            restaurantId,
            orderStatus: "accepted",
        }).countDocuments();
        const readyOrdersLength = await Order.find({
            restaurantId,
            orderStatus: "ready",
        }).countDocuments();
        const deliveringOrdersLength = await Order.find({
            restaurantId,
            orderStatus: "delivering",
        }).countDocuments();
        const newOrders = await Order.find({
            restaurantId,
            orderStatus: "pending",
        })
            .populate("userId")
            .sort({ createdAt: -1 });
        const preparingOrders = await Order.find({
            restaurantId,
            orderStatus: "accepted",
        })
            .populate("userId")
            .sort({ createdAt: -1 });
        const readyOrders = await Order.find({
            restaurantId,
            orderStatus: "ready",
        })
            .populate("userId")
            .sort({ createdAt: -1 });
        const deliveringOrders = await Order.find({
            restaurantId,
            orderStatus: "delivering",
        })
            .populate("userId")
            .sort({ createdAt: -1 });
        return res.status(200).json({
            orders,
            newOrders,
            preparingOrders,
            readyOrders,
            deliveringOrders,
            pendingOrdersLength,
            acceptedOrdersLength,
            readyOrdersLength,
            deliveringOrdersLength,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            cause: error,
        });
    }
};
export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.body;
        const order = await Order.findById(orderId)
            .populate("userId")
            .populate({
            path: "items",
            populate: { path: "itemId" },
        })
            .populate("restaurantId");
        if (!order) {
            return res.status(404).json("Order not found");
        }
        const orderItems = await Item.find({
            _id: { $in: order.items.map((item) => item.itemId) },
        });
        for (const item of orderItems) {
            const getObjectParams = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: item.coverImage,
            };
            const command = new GetObjectCommand(getObjectParams);
            const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
            item.imageUrl = url;
            await item.save();
        }
        return res.status(200).json(order);
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            cause: error,
        });
    }
};
export const acceptAndReadyOrder = async (req, res) => {
    try {
        const restaurantId = req.userId;
        const { orderId } = req.body;
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json("Order not found");
        }
        if (order?.restaurantId.toString() !== restaurantId) {
            return res.status(401).json("Unauthorized");
        }
        if (order?.orderStatus === "pending") {
            order.orderStatus = "accepted";
        }
        else if (order?.orderStatus === "accepted") {
            order.orderStatus = "ready";
        }
        await order.save();
        return res.status(201).json("Success");
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            cause: error,
        });
    }
};
export const toggleRestaurant = async (req, res) => {
    try {
        const restaurantId = req.userId;
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json("Restaurant not found.");
        }
        await Restaurant.findByIdAndUpdate(restaurant._id, {
            $set: {
                isClosed: !restaurant.isClosed,
            },
        });
        return res.status(200).json("Restaurant Closed");
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            cause: error,
        });
    }
};
export const editRestaurantHours = async (req, res) => {
    try {
        const restaurantId = req.userId;
        const { openingHours } = req.body;
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json("Restaurant not found.");
        }
        await Restaurant.findByIdAndUpdate(restaurant._id, { openingHours }, { new: true });
        return res.status(200).json("Restaurant Updated");
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            cause: error,
        });
    }
};
//# sourceMappingURL=restaurant.controllers.js.map