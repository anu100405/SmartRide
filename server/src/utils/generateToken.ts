import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = (userId: string): string => {
  const token = jwt.sign({ userId }, process.env.SECRET_KEY!, {
    expiresIn: "1d",
  });

  return token;
};
