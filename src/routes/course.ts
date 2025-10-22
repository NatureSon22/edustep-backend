import { Router } from "express";
import {
  addCourse,
  editCourse,
  getCourseById,
  getCourses,
  toggleCourseArchiveStatus,
} from "../controller/course.js";
import {
  CourseBodySchema,
  CourseParamsSchema,
  PartialCourseBodySchema,
} from "../validation/course.js";
import validate from "../middleware/validate.js";

const courseRouter = Router();

courseRouter.get("/", getCourses);
courseRouter.get("/:id", validate(CourseParamsSchema, "params"), getCourseById);
courseRouter.post("/", validate(CourseBodySchema, "body"), addCourse);
courseRouter.put(
  "/:id",
  validate(CourseParamsSchema, "params"),
  validate(PartialCourseBodySchema, "body"),
  editCourse
);
courseRouter.put(
  "/:id/archive",
  validate(CourseParamsSchema, "params"),
  toggleCourseArchiveStatus
);

export default courseRouter;
