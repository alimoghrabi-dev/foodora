import { Router } from "express";
import { verifyToken } from "../utils/token.js";
import { addCartItemNote, addItemToCart, changeCartItemQuantity, changePassword, editUserProfile, getAllCategories, getAllRestaurants, getCategoryItems, getNewRestaurants, getOnSaleProducts, getRestaurantByCuisine, getRestaurantById, getRestaurantCategoriesById, getRestaurantCuisines, getRestaurantItemsByCategory, getSearchResults, getUserCartItems, getUserCarts, removeCartItemNote, } from "../controllers/user.controllers.js";
const userRoutes = Router();
userRoutes.put("/edit-profile", verifyToken, editUserProfile);
userRoutes.put("/change-password", verifyToken, changePassword);
userRoutes.get("/get-cuisines", getRestaurantCuisines);
userRoutes.get("/new-restaurants", getNewRestaurants);
userRoutes.get("/get-restaurant-by-id/:id", getRestaurantById);
userRoutes.post("/get-restaurant-items/:id", getRestaurantItemsByCategory);
userRoutes.get("/get-restaurant-categories/:id", getRestaurantCategoriesById);
userRoutes.post("/get-restaurant-by-cuisine", getRestaurantByCuisine);
userRoutes.post("/add-item-to-cart", verifyToken, addItemToCart);
userRoutes.get("/get-all-restaurants", getAllRestaurants);
userRoutes.get("/get-user-carts", verifyToken, getUserCarts);
userRoutes.get("/get-user-cart-items/:id", verifyToken, getUserCartItems);
userRoutes.put("/change-quantity", verifyToken, changeCartItemQuantity);
userRoutes.post("/search-results", getSearchResults);
userRoutes.put("/add-note", verifyToken, addCartItemNote);
userRoutes.put("/remove-note", verifyToken, removeCartItemNote);
userRoutes.get("/get-on-sale-restaurants", getOnSaleProducts);
userRoutes.get("/get-all-categories", getAllCategories);
userRoutes.get("/get-category-items/:categoryId", getCategoryItems);
export default userRoutes;
//# sourceMappingURL=user.routes.js.map