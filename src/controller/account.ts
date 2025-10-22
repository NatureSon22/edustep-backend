import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import {
  AccountBody,
  AccountParams,
  AccountQuery,
  PartialAccountBody,
} from "../validation/account.js";
import AppError from "../utils/appError.js";
import Account from "../models/account.js";

const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const getAccounts = async (
  req: Request<unknown, unknown, unknown, AccountQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { role, status, search } = req.query;

    const filter: Record<string, any> = {};

    if (role && typeof role === "string") filter.role = role;
    if (status && typeof status === "string") filter.status = status;

    // Search by username or email (case-insensitive)
    if (search && typeof search === "string") {
      const safeSearch = escapeRegex(search);
      filter.$or = [
        { username: { $regex: safeSearch, $options: "i" } },
        { email: { $regex: safeSearch, $options: "i" } },
      ];
    }

    const accounts = await Account.find(filter).lean().sort({ createdAt: -1 }); // latest first

    res.status(200).json({
      message: "Accounts retrieved successfully",
      count: accounts.length,
      data: accounts,
    });
  } catch (error) {
    next(error);
  }
};

export const getAccountById = async (
  req: Request<AccountParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const existing = await Account.findById(id);

    if (!existing) {
      return next(new AppError("Account not found", 404));
    }

    res.status(200).json({
      message: "Account retrieved successfully",
      data: existing,
    });
  } catch (error) {
    next(error);
  }
};

export const addAccount = async (
  req: Request<unknown, unknown, AccountBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body;

    const existing = await Account.findOne({ email: data.email });
    if (existing) {
      return next(new AppError("Email already in use", 400));
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newAccount = await Account.create({
      ...data,
      password: hashedPassword,
      role: data.role || "Student",
    });

    res.status(201).json({
      message: "Account created successfully!",
      data: newAccount,
    });
  } catch (error) {
    next(error);
  }
};

export const editAccount = async (
  req: Request<AccountParams, unknown, PartialAccountBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const updatedAccount = await Account.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedAccount) {
      return next(new AppError("Account not found", 404));
    }

    res.status(200).json({
      message: "Account updated successfully",
      data: updatedAccount,
    });
  } catch (error) {
    next(error);
  }
};

export const archiveAccount = async (
  req: Request<AccountParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const archived = await Account.findByIdAndUpdate(
      id,
      { status: "Archived" },
      { new: true, runValidators: true }
    );

    if (!archived) {
      return next(new AppError("Account not found", 404));
    }

    res.status(200).json({
      message: "Account archived successfully",
      data: archived,
    });
  } catch (error) {
    next(error);
  }
};
