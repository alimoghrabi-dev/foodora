import { Router } from "express";
import { approveRejectApply, createApply, getAllApplies, } from "../controllers/apply.controllers.js";
import { createApplyValidator, validate } from "../utils/validators.js";
import { verifyIfUserAdmin, verifyToken } from "../utils/token.js";
const applyRoutes = Router();
applyRoutes.post("/create", validate(createApplyValidator), createApply);
applyRoutes.get("/get-all", verifyToken, verifyIfUserAdmin, getAllApplies);
applyRoutes.put("/reject-approve", verifyToken, verifyIfUserAdmin, approveRejectApply);
export default applyRoutes;
//# sourceMappingURL=apply.routes.js.map