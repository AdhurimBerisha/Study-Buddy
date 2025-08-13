import type { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/requireAuth";
import { Course, User, Purchase, Tutor } from "../models";
import { handleError } from "../helpers/errorHelper";
import sequelize from "../config/db";
import { Op } from "sequelize";

const instructorInclude = {
  model: User,
  as: "instructor",
  attributes: ["id", "firstName", "lastName", "avatar"],
  required: false,
};

const tutorInclude = {
  model: Tutor,
  as: "tutor",
  include: [
    {
      model: User,
      as: "user",
      attributes: ["id", "firstName", "lastName", "avatar"],
    },
  ],
  required: false,
};

const checkAuth = (req: AuthenticatedRequest, res: Response) => {
  if (!req.user?.id) {
    res.status(401).json({ message: "User not authenticated" });
    return null;
  }
  return req.user.id;
};

const checkCourseOwnership = async (courseId: string, userId: string) => {
  const course = await Course.findByPk(courseId);
  if (!course) throw new Error("Course not found");

  const courseData = course.toJSON();
  if (courseData.createdBy !== userId) {
    throw new Error("Only the instructor can perform this action");
  }
  return course;
};

const listCourses = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { category, level, search } = req.query;
    const userId = req.user?.id;

    const whereClause: any = {
      ...(category && { category }),
      ...(level && { level }),
      ...(search && {
        [Op.or]: [
          { title: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
          { language: { [Op.iLike]: `%${search}%` } },
        ],
      }),
    };

    const courses = await Course.findAll({
      where: whereClause,
      include: [instructorInclude, tutorInclude],
      order: [["createdAt", "DESC"]],
    });

    res.json(courses);
  } catch (error) {
    return handleError(res, error, "Error fetching courses");
  }
};

const getCourse = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const course = await Course.findByPk(id, {
      include: [instructorInclude, tutorInclude],
    });
    if (!course) return res.status(404).json({ message: "Course not found" });

    res.json(course);
  } catch (error) {
    return handleError(res, error, "Error fetching course");
  }
};

const createCourse = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = checkAuth(req, res);
    if (!userId) return;

    const {
      title,
      description,
      category,
      language,
      level,
      price,
      thumbnail,
      totalLessons,
      tutorId,
    } = req.body;

    if (
      !title ||
      !description ||
      !category ||
      !language ||
      !level ||
      !tutorId
    ) {
      return res.status(400).json({
        message:
          "Title, description, category, language, level, and tutorId are required",
      });
    }

    const tutor = await Tutor.findOne({ where: { userId } });
    if (!tutor) {
      return res.status(403).json({
        message: "Only tutors can create courses",
      });
    }

    if ((tutor as any).id !== tutorId) {
      return res.status(403).json({
        message: "You can only create courses for your own tutor profile",
      });
    }

    const course = await Course.create({
      title,
      description,
      category,
      language,
      level,
      price: price || 0,
      thumbnail,
      totalLessons,
      createdBy: userId,
      tutorId,
    });

    const createdCourse = await Course.findByPk(course.get("id") as string, {
      include: [instructorInclude, tutorInclude],
    });

    res.status(201).json(createdCourse);
  } catch (error) {
    return handleError(res, error, "Error creating course");
  }
};

const updateCourse = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = checkAuth(req, res);
    if (!userId) return;

    const { id } = req.params;
    const course = await checkCourseOwnership(id, userId);

    await course.update(req.body);
    const updatedCourse = await Course.findByPk(id, {
      include: [instructorInclude, tutorInclude],
    });

    res.json(updatedCourse);
  } catch (error) {
    return handleError(res, error, "Error updating course");
  }
};

const deleteCourse = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = checkAuth(req, res);
    if (!userId) return;

    const { id } = req.params;
    const course = await checkCourseOwnership(id, userId);

    await course.destroy();
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    return handleError(res, error, "Error deleting course");
  }
};

const purchaseCourse = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = checkAuth(req, res);
    if (!userId) return;

    const { id: courseId } = req.params;

    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const existingPurchase = await Purchase.findOne({
      where: { userId, courseId, status: "completed" },
    });

    if (existingPurchase) {
      return res.status(400).json({
        message: "You have already purchased this course",
      });
    }

    const purchase = await Purchase.create({
      userId,
      courseId,
      amount: course.getDataValue("price"),
      status: "completed",
      paymentMethod: "demo",
      transactionId: `demo-${Date.now()}`,
    });

    res.json({
      success: true,
      data: purchase,
      message: "Course purchased successfully",
    });
  } catch (error) {
    handleError(res, error);
  }
};

export {
  listCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  purchaseCourse,
};
