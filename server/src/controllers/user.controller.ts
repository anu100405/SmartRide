import { User } from "../models/user.model";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { generateToken } from "../utils/generateToken";

export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Fill all details",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Confirm Password",
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      // return if user already exist with given email
      return res.status(401).json({
        success: false,
        message: "E-mail already taken",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // hashing password with bcrypt
    await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to register",
    });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Fill all details",
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      // return if user with this email not found
      return res.status(401).json({
        success: false,
        message: "email or password is incorrect",
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      // return if password is not valid
      return res.status(401).json({
        success: false,
        message: "email or password is incorrect",
      });
    }

    user = await User.findOne({ email });

    const token = generateToken(user?._id?.toString()!); // generating token
    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
      .json({
        success: true,
        message: `Welcome back ${user?.username}`,
        user,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to login",
    });
  }
};
