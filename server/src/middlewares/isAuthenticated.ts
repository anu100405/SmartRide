import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

declare global{
    namespace Express{
        interface Request{
            id?: string;
        }
    }
}

const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const token = req.cookies.token; // getting token
    if (!token) {
      // return if token is a falsy value
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY!); // decoding token
    if (!decode || typeof decode === "string" || !decode.userId) {
      // return if not a valid token
      return res.status(401).json({
        success: false,
        message: "Invalid User",
      });
    }

    req.id = decode.userId;

    next(); // passing control to next function
  } catch (error) {
    console.log(error);
  }
};

export default isAuthenticated;