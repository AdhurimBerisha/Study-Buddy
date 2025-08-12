import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/requireAuth";
import { Tutor, User, Course } from "../models";
import { handleError } from "../helpers/errorHelper";
import { Op } from "sequelize";

export const createTutor = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { bio, expertise, hourlyRate } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const existingTutor = await Tutor.findOne({ where: { userId } });
    if (existingTutor) {
      return res
        .status(400)
        .json({ message: "User already has a tutor profile" });
    }

    const tutor = await Tutor.create({
      userId,
      bio,
      expertise,
      hourlyRate,
    });

    const tutorWithUser = await Tutor.findByPk((tutor as any).id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email", "avatar"],
        },
      ],
    });

    res.status(201).json({
      message: "Tutor profile created successfully",
      tutor: tutorWithUser,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const getTutor = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const tutor = await Tutor.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email", "avatar"],
        },
        {
          model: Course,
          as: "courses",
          attributes: [
            "id",
            "title",
            "description",
            "category",
            "level",
            "price",
            "thumbnail",
          ],
        },
      ],
    });

    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found" });
    }

    res.json({ tutor });
  } catch (error) {
    handleError(res, error);
  }
};

export const getAllTutors = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { category, verified, limit = 20, offset = 0 } = req.query;

    const whereClause: any = {};
    if (category) whereClause.expertise = { [Op.like]: `%${category}%` };
    if (verified !== undefined) whereClause.isVerified = verified === "true";

    const tutors = await Tutor.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email", "avatar"],
        },
        {
          model: Course,
          as: "courses",
          attributes: ["id", "title", "category", "level"],
        },
      ],
      limit: Number(limit),
      offset: Number(offset),
      order: [["rating", "DESC"]],
    });

    res.json({
      tutors: tutors.rows,
      total: tutors.count,
      limit: Number(limit),
      offset: Number(offset),
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const updateTutor = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { bio, expertise, hourlyRate } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const tutor = await Tutor.findByPk(id);
    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found" });
    }

    if ((tutor as any).userId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await tutor.update({
      bio,
      expertise,
      hourlyRate,
    });

    const updatedTutor = await Tutor.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email", "avatar"],
        },
      ],
    });

    res.json({
      message: "Tutor profile updated successfully",
      tutor: updatedTutor,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteTutor = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const tutor = await Tutor.findByPk(id);
    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found" });
    }

    if ((tutor as any).userId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await tutor.destroy();

    res.json({ message: "Tutor profile deleted successfully" });
  } catch (error) {
    handleError(res, error);
  }
};

export const getTutorByUserId = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { userId } = req.params;

    const tutor = await Tutor.findOne({
      where: { userId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email", "avatar"],
        },
        {
          model: Course,
          as: "courses",
          attributes: [
            "id",
            "title",
            "description",
            "category",
            "level",
            "price",
            "thumbnail",
          ],
        },
      ],
    });

    if (!tutor) {
      return res.status(404).json({ message: "Tutor profile not found" });
    }

    res.json({ tutor });
  } catch (error) {
    handleError(res, error);
  }
};
