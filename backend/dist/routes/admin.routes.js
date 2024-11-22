import { Router } from "express";
import { AdminLoginValidator, AdminSignUpValidator, validate, } from "../utils/validators.js";
import { verifyToken } from "../utils/token.js";
import { adminLogin, verifyAdmin } from "../controllers/admin.controllers.js";
const adminRoutes = Router();
adminRoutes.post("/sign-up", validate(AdminSignUpValidator));
adminRoutes.post("/login", validate(AdminLoginValidator), adminLogin);
adminRoutes.get("/admin-status", verifyToken, verifyAdmin);
export default adminRoutes;
//# sourceMappingURL=admin.routes.js.map