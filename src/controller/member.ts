import { Request, Response, NextFunction } from "express";
import {
  RoomMemberBody,
  RoomMemberParams,
  RoomMemberQuery,
} from "../validation/member.js";
import member from "../models/member.js";
import AppError from "../utils/appError.js";

export const getMembers = async (
  req: Request<unknown, unknown, unknown, RoomMemberQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const queryFilters = req.query;

    const filter: Record<string, any> = {};

    // Conditionally add filters based on the query parameters
    if (queryFilters.roomId) {
      filter.roomId = queryFilters.roomId;
    }
    if (queryFilters.accountId) {
      filter.accountId = queryFilters.accountId;
    }
    if (queryFilters.status) {
      filter.status = queryFilters.status;
    }

    const members = await member
      .find(filter)
      .lean()
      .sort({ createdAt: -1 })
      .populate("accountId");

    res.status(200).json({
      message: `${members.length} room member(s) retrieved successfully!`,
      data: members,
    });
  } catch (error) {
    next(error);
  }
};

export const getMemberById = async (
  req: Request<RoomMemberParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const existingMember = await member.findById(id).populate("accountId");

    if (!existingMember) {
      return next(new AppError(`Room member not found.`, 404));
    }

    res.status(200).json({
      message: "Room member retrieved successfully!",
      data: existingMember,
    });
  } catch (error) {
    next(error);
  }
};

export const addMember = async (
  req: Request<unknown, unknown, RoomMemberBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body;
    const { roomId, accountId } = data;

    //Check for an existing member record
    const existingMember = await member.findOne({ roomId, accountId });

    if (existingMember) {
      // Member is already Active
      if (existingMember.status === "Active") {
        return next(
          new AppError("Account is already an Active member of this room.", 409)
        );
      }

      // Member is re-joining (status is Removed or Archived)
      const reJoinedMember = await member.findByIdAndUpdate(
        existingMember._id,
        {
          status: "Active", // Reset status to Active
          joinedAt: new Date(), // Set a new joinedAt timestamp
          leftAt: null,
          archivedAt: null, // Clear the archivedAt timestamp
        },
        { new: true, runValidators: true }
      );

      return res.status(200).json({
        message: "Account successfully re-joined the room!",
        data: reJoinedMember,
      });
    }

    // No existing record found - Create a new member
    const newMember = await member.create(data);

    res.status(201).json({
      message: "Room member created successfully!",
      data: newMember,
    });
  } catch (error) {
    next(error);
  }
};

export const removeMember = async (
  req: Request<RoomMemberParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // change status and set the leave timestamp
    const update = {
      status: "Removed",
      leftAt: new Date(),
    };

    const removedMember = await member.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!removedMember) {
      return next(new AppError(`Room member not found.`, 404));
    }

    res.status(200).json({
      message: `Account successfully removed from the room.`,
      data: removedMember,
    });
  } catch (error) {
    next(error);
  }
};
