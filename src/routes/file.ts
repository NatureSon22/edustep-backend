import { Router } from "express";
import { addFile, deleteFile } from "../controller/file.js";
import { checkTotalSize, upload } from "../config/upload.js";
import validate from "../middleware/validate.js";
import { FileParamsSchema } from "../validation/file.js";

const fileRouter = Router();

fileRouter.post("/", upload.array("documents"), checkTotalSize, addFile);
fileRouter.delete("/:id", validate(FileParamsSchema, "params"), deleteFile);

export default fileRouter;
