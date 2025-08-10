import type { Request, Response } from "express";

export const listTutors = async (_req: Request, res: Response) => {
  return res.json([]);
};

export const getTutor = async (_req: Request, res: Response) => {
  return res.json(null);
};
