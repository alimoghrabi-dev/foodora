import { Router } from "express";
import { applyDriver } from "../controllers/apply.controllers.js";
const driverRoutes = Router();
driverRoutes.post("/apply", applyDriver);
export default driverRoutes;
//# sourceMappingURL=driver.routes.js.map