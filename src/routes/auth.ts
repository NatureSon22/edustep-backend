import { Router } from "express";
import validate from "../middleware/validate.js";
import { AuthBodySchema } from "../validation/auth.js";
import { login, logout, register } from "../controller/auth.js";
import { AccountBodySchema } from "../validation/account.js";

const authRouter = Router();

authRouter.post("/register", validate(AccountBodySchema, "body"), register);
authRouter.post("/login", validate(AuthBodySchema, "body"), login);
authRouter.post("/logout", logout);

export default authRouter;
