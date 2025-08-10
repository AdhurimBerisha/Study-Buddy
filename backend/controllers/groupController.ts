import type { Request, Response } from "express";

export const listGroups = async (_req: Request, res: Response) => {
  return res.json([]);
};

export const getGroup = async (_req: Request, res: Response) => {
  return res.json(null);
};

export const joinGroup = async (_req: Request, res: Response) => {
  return res.json({ ok: true });
};

export const leaveGroup = async (_req: Request, res: Response) => {
  return res.json({ ok: true });
};
