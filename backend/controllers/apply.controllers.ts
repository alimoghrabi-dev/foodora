import { Request, Response } from "express";
import Apply from "../models/apply.model.js";
import { io } from "../app.js";
import DriverApply from "../models/driverApply.model.js";

export const createApply = async (req: Request, res: Response) => {
  try {
    const { restaurantName, description, email, phoneNumber, address } =
      req.body;

    const newApply = new Apply({
      restaurantName,
      description,
      email,
      phoneNumber,
      address,
    });

    await newApply.save();

    io.emit("new-apply", newApply);

    return res.status(201).json({ message: "Apply created successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", cause: error });
  }
};

export const getAllApplies = async (req: Request, res: Response) => {
  try {
    const applies = await Apply.find({});

    return res.status(200).json({ data: applies, length: applies.length });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", cause: error });
  }
};

export const approveRejectApply = async (req: Request, res: Response) => {
  try {
    const { applyId } = req.body;

    const apply = await Apply.findById(applyId);

    if (!apply) {
      return res.status(404).json({ message: "Apply not found" });
    }

    await Apply.findByIdAndDelete(apply._id);

    return res.status(200).json("Success");
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", cause: error });
  }
};

export const applyDriver = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      phoneNumber,
      address,
      licenseNumber,
      vehicleType,
      vehicleNumber,
      licenseType,
    } = req.body;

    if (
      !name ||
      !email ||
      !phoneNumber ||
      !address ||
      !licenseNumber ||
      !vehicleType ||
      !vehicleNumber ||
      !licenseType
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newApply = new DriverApply({
      name,
      email,
      phoneNumber,
      address,
      licenseNumber,
      vehicleType,
      vehicleNumber,
      licenseType,
    });

    await newApply.save();

    io.emit("new-driver-apply", newApply);

    return res.status(201).json({ message: "Apply created successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", cause: error });
  }
};
