import { Router } from "express";
import {
  verifyEmailVerificationToken,
  verifyRestaurantRegistrationTokenCreateRoute,
  verifyToken,
} from "../utils/token.js";
import {
  acceptAndReadyOrder,
  addNewItem,
  applyDiscount,
  completeInfo,
  createNewCategory,
  createNewRestaurant,
  creatingVerificationLink,
  editMenuItem,
  editRestaurantHours,
  editRestaurantInfo,
  getItemById,
  getOrderById,
  getRestaurantCategories,
  getRestaurantMenuItems,
  getRestaurantOrders,
  loginRestaurant,
  publishStore,
  removeDiscount,
  renderImage,
  toggleRestaurant,
  verifyEmail,
  verifyRestaurant,
} from "../controllers/restaurant.controllers.js";
import { upload } from "../utils/multer.js";
import Restaurant from "../models/restaurants.model.js";
import cron from "node-cron";
import dayjs from "dayjs";
import { IOpeningHours } from "../types/express.js";

const restaurantRoutes = Router();

restaurantRoutes.post(
  "/register",
  verifyRestaurantRegistrationTokenCreateRoute,
  createNewRestaurant
);

restaurantRoutes.post("/login", loginRestaurant);
restaurantRoutes.get("/auth-status", verifyToken, verifyRestaurant);
restaurantRoutes.get("/get-items", verifyToken, getRestaurantMenuItems);
restaurantRoutes.post(
  "/add-item",
  verifyToken,
  upload.single("image"),
  addNewItem
);
restaurantRoutes.get("/get-categories", verifyToken, getRestaurantCategories);
restaurantRoutes.post("/create-category", verifyToken, createNewCategory);
restaurantRoutes.put(
  "/edit-item/:id",
  verifyToken,
  upload.single("image"),
  editMenuItem
);
restaurantRoutes.put(
  "/complete-info",
  verifyToken,
  upload.single("image"),
  completeInfo
);
restaurantRoutes.get("/render-image", verifyToken, renderImage);
restaurantRoutes.post("/get-item", verifyToken, getItemById);

restaurantRoutes.get("/email-link", verifyToken, creatingVerificationLink);
restaurantRoutes.get(
  "/verify-email",
  verifyEmailVerificationToken,
  verifyEmail
);
restaurantRoutes.put("/publish", verifyToken, publishStore);
restaurantRoutes.put("/apply-discount", verifyToken, applyDiscount);
restaurantRoutes.put("/remove-discount", verifyToken, removeDiscount);
restaurantRoutes.put(
  "/edit-info",
  verifyToken,
  upload.single("image"),
  editRestaurantInfo
);
restaurantRoutes.get("/get-orders", verifyToken, getRestaurantOrders);
restaurantRoutes.post("/get-order-by-id", verifyToken, getOrderById);
restaurantRoutes.put("/accept-ready-order", verifyToken, acceptAndReadyOrder);
restaurantRoutes.put("/toggle-restaurant", verifyToken, toggleRestaurant);
restaurantRoutes.put("/restaurant-hours", verifyToken, editRestaurantHours);

const isRestaurantTimeout = (openingHours: IOpeningHours) => {
  if (!openingHours) {
    console.error("Invalid openingHours object.");
    return true;
  }

  const currentDay = dayjs().format("dddd").toLowerCase();
  //@ts-ignore
  const todayHours = openingHours[currentDay];

  if (!todayHours || !todayHours.opening || !todayHours.closing) {
    console.warn(`No valid hours found for ${currentDay}.`);
    return true;
  }

  const currentTime = dayjs();
  const openingTime = dayjs(todayHours.opening, "HH:mm");
  const closingTime = dayjs(todayHours.closing, "HH:mm");

  return currentTime.isBefore(openingTime) || currentTime.isAfter(closingTime);
};

cron.schedule("* * * * *", async () => {
  try {
    const restaurants = await Restaurant.find({});

    restaurants.forEach(async (restaurant) => {
      const timeoutStatus = isRestaurantTimeout(restaurant.openingHours);

      await Restaurant.findByIdAndUpdate(restaurant._id, {
        isTimeout: timeoutStatus,
      });
    });

    console.log("Updated isTimeout for all restaurants");
  } catch (error) {
    console.error("Error updating isTimeout:", error);
  }
});

export default restaurantRoutes;
