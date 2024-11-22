import { Request, Response } from "express";
import Order from "../models/order.mdoel.js";
import Cart from "../models/cart.model.js";
import { io } from "../app.js";
import User from "../models/user.model.js";
import Restaurant from "../models/restaurants.model.js";

export const createNewOrder = async (req: Request, res: Response) => {
  try {
    const { restaurantId, cartId, checkoutType, totalPrice } = req.body;
    const userId = req.userId;

    if (!restaurantId || !userId || !cartId || !checkoutType || !totalPrice) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const restaurant = await Restaurant.findById(restaurantId);

    if (restaurant?.isClosed || restaurant?.isTimeout) {
      return res.status(400).json({
        message: "Restaurant is currently closed.",
      });
    }

    if (checkoutType !== "cash-on-delivery" && checkoutType !== "which-money") {
      return res.status(401).json({
        message: "Invalid checkout type",
      });
    }

    const cart = await Cart.findById(cartId);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const cartItems = cart.cartItems;

    const ordersLength = await Order.find({}).countDocuments();

    const newOrder = await Order.create({
      userId,
      restaurantId,
      checkoutType,
      totalPrice,
      items: cartItems,
      orderStatus: "pending",
      orderNumber: ordersLength + 1,
    });

    const user = await User.findById(userId);

    await User.findByIdAndUpdate(userId, {
      $pull: {
        cartId: cart._id,
      },
    });
    await Cart.findByIdAndDelete(cart._id);

    io.emit("new-order", {
      username: user?.name,
      restaurantId: newOrder?.restaurantId,
    });

    return res.status(201).json({ orderId: newOrder._id });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      //@ts-ignore
      cause: error.message,
    });
  }
};

export const getActiveOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const orders = await Order.find({
      userId,
      orderStatus: { $ne: "delivered" },
    }).populate("restaurantId");

    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      cause: error,
    });
  }
};

export const getPastOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const orders = await Order.find({
      userId,
      orderStatus: "delivered",
    });

    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      cause: error,
    });
  }
};
