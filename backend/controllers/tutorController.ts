import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/requireAuth";
import { Tutor, Course, User, Lesson } from "../models";
import { handleError } from "../helpers/errorHelper";
import { createPaginationResponse } from "../helpers/adminHelper";
import { Op, QueryTypes } from "sequelize";
import sequelize from "../config/db";

const createTutor = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { bio, expertise, first_name, last_name, email, avatar, userId } =
      req.body;

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
      userId,
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
      order: [["createdAt", "DESC"]],
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

const createCourse = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const tutor = await Tutor.findOne({ where: { userId } });
    if (!tutor) {
      return res
        .status(403)
        .json({ message: "Only tutors can create courses" });
    }

    const {
      title,
      description,
      category,
      level,
      price,
      thumbnail,
      totalLessons,
      lessons,
    } = req.body;

    if (!title || !description || !category || !level) {
      return res.status(400).json({
        message:
          "Title, description, category, and level are required",
      });
    }

    const result = await sequelize.transaction(async (t) => {
      const course = await Course.create(
        {
          title,
          description,
          category,
          level,
          price: price || 0,
          thumbnail,
          totalLessons,
          tutorId: userId,
        },
        { transaction: t }
      );

      const courseId = course.get("id") as string;

      if (lessons && Array.isArray(lessons) && lessons.length > 0) {
        const lessonPromises = lessons.map((lesson: any) => {
          const lessonData = {
            courseId: courseId,
            title: lesson.title,
            content: lesson.content,
            order: lesson.order,
            duration: lesson.duration || null,
            resources: lesson.resources || null,
            isActive: true,
          };
          return Lesson.create(lessonData, { transaction: t });
        });

        await Promise.all(lessonPromises);
      }

      return course;
    });

    const courseId = result.get("id") as string;

    const createdCourse = await Course.findByPk(courseId, {
      include: [
        {
          model: User,
          as: "tutor",
          attributes: ["id", "firstName", "lastName", "email"],
        },
        {
          model: Lesson,
          as: "lessons",
          attributes: [
            "id",
            "title",
            "content",
            "order",
            "duration",
            "resources",
            "isActive",
          ],
          order: [["order", "ASC"]],
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: createdCourse,
    });
  } catch (error) {
    handleError(res, error, "Error creating course");
  }
};

const getTutorCourses = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const tutor = await Tutor.findOne({ where: { userId } });
    if (!tutor) {
      return res
        .status(403)
        .json({ message: "Only tutors can access this endpoint" });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const offset = (page - 1) * limit;

    const { count, rows: courses } = await Course.findAndCountAll({
      where: { tutorId: userId },
      include: [
        {
          model: User,
          as: "tutor",
          attributes: ["id", "firstName", "lastName", "email"],
        },
        {
          model: Lesson,
          as: "lessons",
          attributes: ["id", "title", "order", "duration", "isActive"],
          order: [["order", "ASC"]],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    const response = createPaginationResponse(
      courses,
      count,
      page,
      limit,
      "Courses"
    );

    res.json(response);
  } catch (error) {
    handleError(res, error, "Error fetching tutor courses");
  }
};

const getTutorDashboardStats = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const tutor = await Tutor.findOne({ where: { userId } });
    if (!tutor) {
      return res
        .status(403)
        .json({ message: "Only tutors can access this endpoint" });
    }

    const courseCount = await Course.count({ where: { tutorId: userId } });

    const totalStudents = await sequelize.query(
      `
      SELECT COUNT(DISTINCT p.userId) as studentCount
      FROM purchases p
      INNER JOIN courses c ON p.courseId = c.id
      WHERE c.tutor_id = :tutorId
    `,
      {
        replacements: { tutorId: userId },
        type: QueryTypes.SELECT,
      }
    );

    const totalRevenue = await sequelize.query(
      `
      SELECT COALESCE(SUM(p.amount), 0) as totalRevenue
      FROM purchases p
      INNER JOIN courses c ON p.courseId = c.id
      WHERE c.tutor_id = :tutorId
    `,
      {
        replacements: { tutorId: userId },
        type: QueryTypes.SELECT,
      }
    );

    const stats = {
      totalCourses: courseCount,
      totalStudents: (totalStudents[0] as any)?.studentCount || 0,
      totalRevenue: parseFloat((totalRevenue[0] as any)?.totalRevenue || "0"),
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    handleError(res, error, "Error fetching tutor dashboard stats");
  }
};

export {
  createTutor,
  getTutor,
  getAllTutors,
  updateTutor,
  deleteTutor,
  createCourse,
  getTutorCourses,
  getTutorDashboardStats,
};
