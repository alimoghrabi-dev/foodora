import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { DecodedToken } from "../types/express.js";
import User from "../models/user.model.js";
import Restaurant from "../models/restaurants.model.js";

export const generateToken = (id: string) => {
  const payload = { id };
  const secret = process.env.JWT_SECRET as string;

  const options: jwt.SignOptions = {
    expiresIn: "15d",
  };

  const token = jwt.sign(payload, secret, options);
  return token;
};

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: missing token" });
  }

  const secret = process.env.JWT_SECRET as string;

  const decoded = jwt.verify(token, secret) as DecodedToken;

  if (!decoded) {
    return res.status(401).json({ message: "Unauthorized: invalid token" });
  }

  const userId = decoded.id;

  req.userId = userId;

  next();
};

export const verifyIfUserAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", cause: error });
  }
};

export const verifyRestaurantRegistrationToken = async (
  req: Request,
  res: Response
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "missing token" });
    }

    const secret = process.env.JWT_SECRET as string;

    const decoded = jwt.verify(token, secret) as DecodedToken;

    if (!decoded) {
      return res.status(401).json({ message: "invalid token" });
    }

    const restaurantEmail = decoded.email;

    const existingRes = await Restaurant.findOne({ email: restaurantEmail });

    return res
      .status(200)
      .json({ restaurantEmail, token, isExisting: !!existingRes });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", cause: error });
  }
};

export const verifyRestaurantRegistrationTokenCreateRoute = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "missing token" });
    }

    const secret = process.env.JWT_SECRET as string;

    const decoded = jwt.verify(token, secret) as DecodedToken;

    if (!decoded) {
      return res.status(401).json({ message: "invalid token" });
    }

    const restaurantEmail = decoded.email;

    req.restaurantEmail = restaurantEmail;

    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", cause: error });
  }
};

export const verifyEmailVerificationToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: missing token" });
  }

  const secret = process.env.JWT_SECRET as string;

  const decoded = jwt.verify(token, secret) as DecodedToken;

  if (!decoded) {
    return res.status(401).json({ message: "Unauthorized: invalid token" });
  }

  const userId = decoded.id;

  req.userId = userId;

  next();
};
