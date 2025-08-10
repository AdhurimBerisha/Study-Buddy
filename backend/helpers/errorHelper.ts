import { Response } from "express";

export const handleError = (
  res: Response,
  error: any,
  message = "Internal server error"
) => {
  console.error(message, error);
  return res.status(500).json({ success: false, message });
};
