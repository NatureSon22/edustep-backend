import { NextFunction, Request, Response } from "express";
import {
  CourseBody,
  CourseParams,
  PartialCourseBody,
} from "../validation/course.js";
import course from "../models/course.js";
import AppError from "../utils/appError.js";

const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const getCourses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { isArchived, search } = req.query;

    const filter: Record<string, any> = {};

    // Handle isArchived query param
    if (isArchived === undefined) {
      filter.isArchived = false; // default to active courses
    } else {
      filter.isArchived = isArchived === "true";
    }

    if (search && typeof search === "string") {
      const safeSearch = escapeRegex(search);
      filter.$or = [
        { name: { $regex: safeSearch, $options: "i" } },
        { description: { $regex: safeSearch, $options: "i" } },
      ];
    }

    const courses = await course.find(filter).lean().sort({ createdAt: -1 });

    res.status(200).json({
      message: "Courses retrieved successfully",
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};

export const getCourseById = async (
  req: Request<CourseParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const courseId = req.params.id;

    const existing = await course.findById(courseId);

    if (!existing) {
      return next(new AppError("Course not found with that ID", 404));
    }

    res.status(200).json({
      message: "Course fetched successfully!",
      data: existing,
    });
  } catch (error) {
    next(error);
  }
};

export const addCourse = async (
  req: Request<unknown, unknown, CourseBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body;

    const existing = await course.findOne({ name: data.name });
    if (existing) {
      return next(new AppError("Course name already exists", 400));
    }

    const newCourse = await course.create(data);

    res.status(201).json({
      message: "Course created successfully!",
      data: newCourse,
    });
  } catch (error) {
    next(error);
  }
};

export const editCourse = async (
  req: Request<CourseParams, unknown, PartialCourseBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const courseId = req.params.id;
    const updates = req.body;

    const updatedCourse = await course.findByIdAndUpdate(
      courseId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      return next(new AppError("Course not found", 404));
    }

    res.status(200).json({
      message: "Course updated successfully!",
      data: updatedCourse,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleCourseArchiveStatus = async (
  req: Request<CourseParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const courseId = req.params.id;

    const currentCourse = await course.findById(courseId);

    if (!currentCourse) {
      return next(new AppError("Course not found", 404));
    }

    let message: string;
    let updatePayload: any;

    const isCurrentlyArchived = currentCourse.isArchived;

    if (isCurrentlyArchived) {
      // Logic for UNARCHIVING (Current state is archived)
      message = "Course successfully unarchived!";
      updatePayload = {
        isArchived: false,
        // $unset: { archivedAt: 1 }, // Remove the timestamp
      };
    } else {
      // Logic for ARCHIVING (Current state is not archived)
      message = "Course successfully archived!";
      updatePayload = {
        isArchived: true,
        // archivedAt: new Date(), // Set the timestamp
      };
    }

    const updatedCourse = await course.findByIdAndUpdate(
      courseId,
      updatePayload,
      { new: true, runValidators: true }
    );

    // 4. Success Response: Send 200 OK
    res.status(200).json({
      message: message,
      data: updatedCourse,
    });
  } catch (error) {
    next(error);
  }
};
