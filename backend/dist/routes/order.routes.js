import { Router } from "express";
import { verifyToken } from "../utils/token.js";
import { createNewOrder, getActiveOrders, getPastOrders, } from "../controllers/order.controllers.js";
const orderRoutes = Router();
orderRoutes.post("/create-order", verifyToken, createNewOrder);
orderRoutes.get("/active-orders", verifyToken, getActiveOrders);
orderRoutes.get("/past-orders", verifyToken, getPastOrders);
export default orderRoutes;
//# sourceMappingURL=order.routes.js.map