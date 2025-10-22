import { NextFunction, Request, Response } from "express";
import { AuthBody } from "../validation/auth.js";
import account from "../models/account.js";
import AppError from "../utils/appError.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import jwt from "jsonwebtoken";
import { AccountBody } from "../validation/account.js";

export const register = async (
  req: Request<unknown, unknown, AccountBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body;

    // Check if email already exists
    const accountExists = await account.findOne({ email: data.email }).lean();
    if (accountExists) {
      return next(new AppError("Email is already registered", 400));
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create new account
    const newAccount = await account.create({
      ...data,
      password: hashedPassword,
    });

    const authToken = jwt.sign(
      { accountId: newAccount._id, role: newAccount.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    res.cookie("authToken", authToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(201).json({
      message: "Account created successfully",
      data: newAccount,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request<unknown, unknown, AuthBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const accountExists = await account.findOne({ email }).lean();
    if (!accountExists) {
      return next(new AppError("No account found with this email", 404));
    }

    const isMatched = await verifyPassword(password, accountExists.password);
    if (!isMatched) {
      return next(new AppError("Invalid credentials", 401));
    }

    if (accountExists.status === "Inactive") {
      return next(new AppError("Account is inactive", 403));
    }

    const authToken = jwt.sign(
      { accountId: accountExists._id, role: accountExists.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    res.cookie("authToken", authToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(200).json({
      data: accountExists,
      message: "Login successful!",
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(200).json({ message: "Logout Successful" });
  } catch (error) {
    next(error);
  }
};
