import type { Request, Response } from "express";

export const listCourses = async (_req: Request, res: Response) => {
  return res.json([]);
};

export const getCourse = async (_req: Request, res: Response) => {
  return res.json(null);
};
