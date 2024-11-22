import { body, validationResult } from "express-validator";
import crypto from "crypto";
export const randomName = () => crypto.randomBytes(32).toString("hex");
export const validate = (validations) => {
    return async (req, res, next) => {
        for (let validation of validations) {
            const result = await validation.run(req);
            if (!result.isEmpty()) {
                break;
            }
        }
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }
        res.status(400).json({ errors: errors.array() });
    };
};
export const SignUpValidator = [
    body("name").notEmpty().withMessage("Name is required"),
    body("nickname").optional(),
    body("email").trim().isEmail().withMessage("Email is required"),
    body("password")
        .notEmpty()
        .isLength({ min: 6 })
        .withMessage("Password is required, at least 6 characters"),
    body("phoneNumber").notEmpty().withMessage("Phone number is required"),
];
export const LoginValidator = [
    body("email").trim().isEmail().withMessage("Email is required"),
    body("password")
        .notEmpty()
        .isLength({ min: 6 })
        .withMessage("Password should be at least 6 characters"),
];
export const AdminSignUpValidator = [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").trim().isEmail().withMessage("Email is required"),
    body("password")
        .notEmpty()
        .isLength({ min: 6 })
        .withMessage("Password is required, at least 6 characters"),
    body("phoneNumber").notEmpty().withMessage("Phone number is required"),
];
export const AdminLoginValidator = [
    body("email").trim().isEmail().withMessage("Email is required"),
    body("password")
        .notEmpty()
        .isLength({ min: 6 })
        .withMessage("Password should be at least 6 characters"),
];
export const createApplyValidator = [
    body("restaurantName").notEmpty().withMessage("Restaurant name is required"),
    body("email").trim().isEmail().withMessage("Email is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("phoneNumber").notEmpty().withMessage("Phone number is required"),
    body("address").notEmpty().withMessage("Address is required"),
];
//# sourceMappingURL=validators.js.map