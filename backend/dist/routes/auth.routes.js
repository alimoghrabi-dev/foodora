import { Router } from "express";
import { LoginValidator, SignUpValidator, validate, } from "../utils/validators.js";
import { checkIfEmailAlreadyUsed, generateRegestrationToken, loginUser, signupUser, verifyUser, } from "../controllers/auth.controllers.js";
import { verifyRestaurantRegistrationToken, verifyToken, } from "../utils/token.js";
const authRoutes = Router();
authRoutes.post("/sign-up", validate(SignUpValidator), signupUser);
authRoutes.post("/login", validate(LoginValidator), loginUser);
authRoutes.get("/auth-status", verifyToken, verifyUser);
authRoutes.post("/email-check", checkIfEmailAlreadyUsed);
authRoutes.post("/generate-registration-token", generateRegestrationToken);
authRoutes.get("/generate-registration-status", verifyRestaurantRegistrationToken);
export default authRoutes;
//# sourceMappingURL=auth.routes.js.map