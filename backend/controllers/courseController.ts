import type { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/requireAuth";
import { Course, User, Purchase } from "../models";
import { handleError } from "../helpers/errorHelper";
import sequelize from "../config/db";
import { Op } from "sequelize";

// Common instructor include
const instructorInclude = {
  model: User,
  as: "instructor",
  attributes: ["id", "firstName", "lastName", "avatar"],
  required: false,
};

// Helper for authentication check
const checkAuth = (req: AuthenticatedRequest, res: Response) => {
  if (!req.user?.id) {
    res.status(401).json({ message: "User not authenticated" });
    return null;
  }
  return req.user.id;
};

// Helper for course ownership check
const checkCourseOwnership = async (courseId: string, userId: string) => {
  const course = await Course.findByPk(courseId);
  if (!course) throw new Error("Course not found");

  const courseData = course.toJSON();
  if (courseData.createdBy !== userId) {
    throw new Error("Only the instructor can perform this action");
  }
  return course;
};

export const listCourses = async (req: AuthenticatedRequest, res: Response) => {
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
      include: [instructorInclude],
      order: [["createdAt", "DESC"]],
    });

    res.json(courses);
  } catch (error) {
    return handleError(res, error, "Error fetching courses");
  }
};

export const getCourse = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const course = await Course.findByPk(id, { include: [instructorInclude] });
    if (!course) return res.status(404).json({ message: "Course not found" });

    res.json(course);
  } catch (error) {
    return handleError(res, error, "Error fetching course");
  }
};

export const createCourse = async (
  req: AuthenticatedRequest,
  res: Response
) => {
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
    } = req.body;

    if (!title || !description || !category || !language || !level) {
      return res.status(400).json({
        message:
          "Title, description, category, language, and level are required",
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
    });

    const createdCourse = await Course.findByPk(course.get("id") as string, {
      include: [instructorInclude],
    });

    res.status(201).json(createdCourse);
  } catch (error) {
    return handleError(res, error, "Error creating course");
  }
};

export const updateCourse = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = checkAuth(req, res);
    if (!userId) return;

    const { id } = req.params;
    const course = await checkCourseOwnership(id, userId);

    await course.update(req.body);
    const updatedCourse = await Course.findByPk(id, {
      include: [instructorInclude],
    });

    res.json(updatedCourse);
  } catch (error) {
    return handleError(res, error, "Error updating course");
  }
};

export const deleteCourse = async (
  req: AuthenticatedRequest,
  res: Response
) => {
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

// Purchase course (creates purchase record)
export const purchaseCourse = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = checkAuth(req, res);
    if (!userId) return;

    const { id: courseId } = req.params;

    // Check if course exists
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if user already purchased this course
    const existingPurchase = await Purchase.findOne({
      where: { userId, courseId, status: "completed" },
    });

    if (existingPurchase) {
      return res.status(400).json({
        message: "You have already purchased this course",
      });
    }

    // Create purchase record
    const purchase = await Purchase.create({
      userId,
      courseId,
      amount: course.getDataValue("price"),
      status: "completed",
      paymentMethod: "demo", // For demo purposes
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
