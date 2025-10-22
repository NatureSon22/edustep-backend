import { Router } from "express";
import {
  addAccount,
  archiveAccount,
  editAccount,
  getAccountById,
  getAccounts,
} from "../controller/account.js";
import validate from "../middleware/validate.js";
import {
  AccountBodySchema,
  AccountParamsSchema,
  PartialAccountBodySchema,
} from "../validation/account.js";

const accountRouter = Router();

accountRouter.get("/", getAccounts);
accountRouter.get(
  "/:id",
  validate(AccountParamsSchema, "params"),
  getAccountById
);
accountRouter.post("/", validate(AccountBodySchema, "body"), addAccount);
accountRouter.put(
  "/:id",
  validate(AccountParamsSchema, "params"),
  validate(PartialAccountBodySchema, "body"),
  editAccount
);
accountRouter.put(
  "/:id/archive",
  validate(AccountParamsSchema, "params"),
  archiveAccount
);

export default accountRouter;
