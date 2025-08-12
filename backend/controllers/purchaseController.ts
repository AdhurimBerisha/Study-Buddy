import type { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/requireAuth";
import { Purchase, Course, User, LessonProgress, Lesson } from "../models";
import { handleError } from "../helpers/errorHelper";
import { Op } from "sequelize";

// Helper for authentication check
const checkAuth = (req: AuthenticatedRequest, res: Response) => {
  if (!req.user?.id) {
    res.status(401).json({ message: "User not authenticated" });
    return null;
  }
  return req.user.id;
};

// Create a new purchase record
export const createPurchase = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = checkAuth(req, res);
    if (!userId) return;

    const { courseId, amount, paymentMethod, transactionId } = req.body;

    // Validate required fields
    if (!courseId || !amount) {
      return res.status(400).json({
        message: "Course ID and amount are required",
      });
    }

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

// Get user's purchase history
export const getUserPurchases = async (
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
          attributes: [
            "id",
            "title",
            "description",
            "language",
            "thumbnail", // Fix: use thumbnail instead of imageUrl
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

// Get user's learning dashboard data (purchased courses with progress)
export const getLearningDashboard = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = checkAuth(req, res);
    if (!userId) return;

    console.log("🔍 Getting learning dashboard for user:", userId);

    // Get all completed purchases
    const purchases = await Purchase.findAll({
      where: { userId, status: "completed" },
      include: [
        {
          model: Course,
          as: "course",
          attributes: ["id", "title", "language", "thumbnail"],
        },
      ],
      order: [["purchaseDate", "DESC"]],
    });

    console.log("📦 Found purchases:", purchases.length);
    console.log("📦 Purchase details:", JSON.stringify(purchases, null, 2));

    // Get progress for each purchased course
    const coursesWithProgress = await Promise.all(
      purchases.map(async (purchase) => {
        const course = (purchase as any).course;
        const courseId = course.id;

        console.log("📚 Processing course:", courseId, course.title);

        // Get total lessons for this course
        const totalLessons = await Lesson.count({
          where: { courseId, isActive: true },
        });

        // Get completed lessons
        const completedLessons = await LessonProgress.count({
          where: {
            userId,
            courseId,
            isCompleted: true,
          },
        });

        // Calculate progress percentage
        const progressPercentage =
          totalLessons > 0
            ? Math.round((completedLessons / totalLessons) * 100)
            : 0;

        // Get last accessed lesson
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
          language: course.language,
          imageUrl: course.thumbnail,
          progress: progressPercentage,
          lastAccessed,
          totalLessons,
          completedLessons,
          purchaseDate: purchase.purchaseDate,
        };

        console.log("✅ Final course data:", courseData);
        return courseData;
      })
    );

    console.log(
      "🎯 Sending response with",
      coursesWithProgress.length,
      "courses"
    );
    console.log(
      "🎯 Response data:",
      JSON.stringify(coursesWithProgress, null, 2)
    );

    res.json({
      success: true,
      data: coursesWithProgress,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Check if user has purchased a specific course
export const checkCoursePurchase = async (
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

// Helper function to format time ago
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
