import { NextFunction, Request, Response } from "express";
import { PartialRoomBody, RoomBody, RoomParams } from "../validation/room.js";
import room from "../models/room.js";
import AppError from "../utils/appError.js";

//TODO populate fields

const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const getRooms = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { classSection, isArchived, isActive, search } = req.query;

    const filter: Record<string, any> = {};

    // Case-insensitive classSection filter
    if (classSection && typeof classSection === "string") {
      filter.classSection = {
        $regex: `^${escapeRegex(classSection)}$`,
        $options: "i",
      };
    }

    // Boolean filters
    if (isArchived !== undefined) {
      filter.isArchived = isArchived === "true";
    }
    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    // Search by name or joinCode (case-insensitive)
    if (search && typeof search === "string") {
      const safeSearch = escapeRegex(search);
      filter.$or = [
        { name: { $regex: safeSearch, $options: "i" } },
        { joinCode: { $regex: safeSearch, $options: "i" } },
      ];
    }

    const rooms = await room
      .find(filter)
      .lean()
      .sort({ createdAt: -1 })
      .populate("courseId creatorId");

    res.status(200).json({
      message: "Rooms retrieved successfully",
      count: rooms.length,
      data: rooms,
    });
  } catch (error) {
    next(error);
  }
};

export const getRoomById = async (
  req: Request<RoomParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const roomId = req.params.id;

    const existing = await room.findById(roomId).populate("courseId creatorId");

    if (!existing) {
      return next(new AppError("Room not found", 404));
    }

    res.status(200).json({
      message: "Room fetched successfully!",
      data: existing,
    });
  } catch (error) {
    next(error);
  }
};

export const addRoom = async (
  req: Request<unknown, unknown, RoomBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body;

    // Check for existing joinCode
    const existing = await room.findOne({ joinCode: data.joinCode });
    if (existing) {
      return next(new AppError("Join code already in use", 400));
    }

    const newRoom = await room.create({
      ...data,
    });

    res.status(201).json({
      message: "Room created successfully!",
      data: newRoom,
    });
  } catch (error) {
    next(error);
  }
};

export const editRoom = async (
  req: Request<RoomParams, unknown, PartialRoomBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedRoom = await room.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedRoom) {
      return next(new AppError("Room not found", 404));
    }

    res.status(200).json({
      message: "Room updated successfully!",
      data: updatedRoom,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleRoomArchiveStatus = async (
  req: Request<RoomParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const roomId = req.params.id;

    const currentRoom = await room.findById(roomId);

    if (!currentRoom) {
      return next(new AppError("Room not found", 404));
    }

    let message: string;
    let updatePayload: any;

    const isCurrentlyArchived = currentRoom.isArchived;

    if (isCurrentlyArchived) {
      // Logic for UNARCHIVING
      message = "Room successfully unarchived!";
      updatePayload = {
        isArchived: false,
        isActive: true,
        $unset: { archivedAt: 1 }, // Remove the timestamp
      };
    } else {
      // Logic for ARCHIVING
      message = "Room successfully archived!";
      updatePayload = {
        isArchived: true,
        isActive: false,
        archivedAt: new Date(), // Set the timestamp
      };
    }

    const updatedRoom = await room.findByIdAndUpdate(roomId, updatePayload, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: message,
      data: updatedRoom,
    });
  } catch (error) {
    next(error);
  }
};
