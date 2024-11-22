import { Request, Response } from "express";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.js";
import Apply from "../models/apply.model.js";
import jwt from "jsonwebtoken";
import Cart from "../models/cart.model.js";
import Order from "../models/order.mdoel.js";

export const signupUser = async (req: Request, res: Response) => {
  try {
    const { name, email, nickname, phoneNumber, password, confirmPassword } =
      req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = new User({
      name,
      email,
      nickname,
      password: hashedPassword,
      phoneNumber,
    });

    await newUser.save();

    const cart = new Cart({ userId: newUser._id });

    await User.findByIdAndUpdate(newUser._id, { cartId: cart._id });

    await cart.save();

    return res.status(201).json({
      message: "User created successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      cause: error,
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password || "");

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Password is invalid" });
    }

    const token = generateToken(user._id as string);

    return res.status(200).json({
      message: "User logged in successfully",
      token,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      cause: error,
    });
  }
};

export const verifyUser = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId)
      .select("-password")
      .populate({
        path: "cartId",
        populate: {
          path: "cartItems",
        },
      });

    const userOrdersLength = await Order.find({
      userId,
      orderStatus: { $ne: "delivered" },
    }).countDocuments();

    return res.status(200).json({ user, userOrdersLength });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      cause: error,
    });
  }
};

export const checkIfEmailAlreadyUsed = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      return res.status(404).json({ message: "Email already used" });
    }

    return res.status(200).json({ message: "Email available" });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      cause: error,
    });
  }
};

export const generateRegestrationToken = async (
  req: Request,
  res: Response
) => {
  try {
    const { email } = req.body;

    const token = jwt.sign({ email }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      cause: error,
    });
  }
};
