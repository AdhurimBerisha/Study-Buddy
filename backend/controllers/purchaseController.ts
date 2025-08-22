import type { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/requireAuth";
import { Purchase, Course, User, LessonProgress, Lesson } from "../models";
import { handleError } from "../helpers/errorHelper";
import { Op } from "sequelize";

const checkAuth = (req: AuthenticatedRequest, res: Response) => {
  if (!req.user?.id) {
    res.status(401).json({ message: "User not authenticated" });
    return null;
  }
  return req.user.id;
};

const createPurchase = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = checkAuth(req, res);
    if (!userId) return;

    const { courseId, amount, paymentMethod, transactionId } = req.body;

    if (!courseId || !amount) {
      return res.status(400).json({
        message: "Course ID and amount are required",
      });
    }

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
      amount,
      status: "completed",
      paymentMethod,
      transactionId,
    });

    res.status(201).json({
      success: true,
      data: purchase,
      message: "Course purchased successfully",
    });
  } catch (error) {
    handleError(res, error);
  }
};

const getUserPurchases = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = checkAuth(req, res);
    if (!userId) return;

    const purchases = await Purchase.findAll({
      where: { userId, status: "completed" },
      include: [
        {
          model: Course,
          as: "course",
          attributes: [
            "id",
            "title",
            "description",
            "language",
            "thumbnail",
            "duration",
          ],
        },
      ],
      order: [["purchaseDate", "DESC"]],
    });

    res.json({
      success: true,
      data: purchases,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const getLearningDashboard = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = checkAuth(req, res);
    if (!userId) return;

    const purchases = await Purchase.findAll({
      where: { userId, status: "completed" },
      include: [
        {
          model: Course,
          as: "course",
          attributes: ["id", "title", "thumbnail"],
        },
      ],
      order: [["purchaseDate", "DESC"]],
    });

    const coursesWithProgress = await Promise.all(
      purchases.map(async (purchase) => {
        const course = (purchase as any).course;
        const courseId = course.id;

        const totalLessons = await Lesson.count({
          where: { courseId, isActive: true },
        });

        const completedLessons = await LessonProgress.count({
          where: {
            userId,
            courseId,
            isCompleted: true,
          },
        });

        const progressPercentage =
          totalLessons > 0
            ? Math.round((completedLessons / totalLessons) * 100)
            : 0;

        const lastProgress = await LessonProgress.findOne({
          where: { userId, courseId },
          order: [["lastAccessedAt", "DESC"]],
        });

        const lastAccessed = lastProgress?.getDataValue("lastAccessedAt")
          ? formatTimeAgo(lastProgress.getDataValue("lastAccessedAt") as Date)
          : "Never";

        const courseData = {
          id: course.id,
          title: course.title,

          imageUrl: course.thumbnail,
          progress: progressPercentage,
          lastAccessed,
          totalLessons,
          completedLessons,
          purchaseDate: purchase.purchaseDate,
        };

        return courseData;
      })
    );

    res.json({
      success: true,
      data: coursesWithProgress,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const checkCoursePurchase = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = checkAuth(req, res);
    if (!userId) return;

    const { courseId } = req.params;

    const purchase = await Purchase.findOne({
      where: { userId, courseId, status: "completed" },
    });

    res.json({
      success: true,
      data: {
        hasPurchased: !!purchase,
        purchase: purchase || null,
      },
    });
  } catch (error) {
    handleError(res, error);
  }
};

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - new Date(date).getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

  if (diffInDays > 0) {
    return diffInDays === 1 ? "1 day ago" : `${diffInDays} days ago`;
  } else if (diffInHours > 0) {
    return diffInHours === 1 ? "1 hour ago" : `${diffInHours} hours ago`;
  } else if (diffInMinutes > 0) {
    return diffInMinutes === 1
      ? "1 minute ago"
      : `${diffInMinutes} minutes ago`;
  } else {
    return "Just now";
  }
}

export {
  createPurchase,
  getUserPurchases,
  getLearningDashboard,
  checkCoursePurchase,
};
