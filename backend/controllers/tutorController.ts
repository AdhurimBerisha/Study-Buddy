import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/requireAuth";
import { Tutor, Course } from "../models";
import { handleError } from "../helpers/errorHelper";
import { Op } from "sequelize";

const createTutor = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { bio, expertise, first_name, last_name, email, avatar } = req.body;

    const existingTutor = await Tutor.findOne({ where: { email } });
    if (existingTutor) {
      return res
        .status(400)
        .json({ message: "Tutor with this email already exists" });
    }

    const tutor = await Tutor.create({
      first_name,
      last_name,
      email,
      bio,
      expertise,
      avatar,
    });

    res.status(201).json({
      message: "Tutor profile created successfully",
      tutor,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const getTutor = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const tutor = await Tutor.findByPk(id, {
      include: [
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

const getAllTutors = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { category, verified, limit = 20, offset = 0 } = req.query;

    const whereClause: any = {};
    if (category) whereClause.expertise = { [Op.like]: `%${category}%` };
    if (verified !== undefined) whereClause.isVerified = verified === "true";

    const tutors = await Tutor.findAndCountAll({
      where: whereClause,
      include: [
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

const updateTutor = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { bio, expertise, first_name, last_name, email, avatar } = req.body;

    const tutor = await Tutor.findByPk(id);
    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found" });
    }

    await tutor.update({
      bio,
      expertise,
      first_name,
      last_name,
      email,
      avatar,
    });

    res.json({
      message: "Tutor profile updated successfully",
      tutor,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const deleteTutor = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const tutor = await Tutor.findByPk(id);
    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found" });
    }

    await tutor.destroy();

    res.json({ message: "Tutor profile deleted successfully" });
  } catch (error) {
    handleError(res, error);
  }
};

export { createTutor, getTutor, getAllTutors, updateTutor, deleteTutor };
