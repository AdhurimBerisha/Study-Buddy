import type { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/requireAuth";
import { Lesson, Course, LessonProgress } from "../models";
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

// Get all lessons for a course
export const getCourseLessons = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { courseId } = req.params;
    const userId = req.user?.id;

    // Check if course exists
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Get lessons ordered by order field
    const lessons = await Lesson.findAll({
      where: {
        courseId,
        isActive: true,
      },
      order: [["order", "ASC"]],
      attributes: [
        "id",
        "title",
        "content",
        "order",
        "duration",
        "resources",
        "createdAt",
        "updatedAt",
      ],
    });

    // If user is authenticated, get their progress
    let userProgress: Record<string, any> = {};
    if (userId) {
      const progress = await LessonProgress.findAll({
        where: {
          userId,
          courseId,
        },
        attributes: [
          "lessonId",
          "isCompleted",
          "completedAt",
          "timeSpent",
          "lastAccessedAt",
        ],
      });

      userProgress = progress.reduce((acc, p) => {
        const progressData = p.toJSON();
        acc[progressData.lessonId] = progressData;
        return acc;
      }, {} as Record<string, any>);
    }

    // Add progress info to lessons
    const lessonsWithProgress = lessons.map((lesson) => {
      const lessonData = lesson.toJSON();
      return {
        ...lessonData,
        progress: userProgress[lessonData.id] || null,
      };
    });

    res.json({
      success: true,
      data: {
        course: {
          id: course.getDataValue("id"),
          title: course.getDataValue("title"),
          language: course.getDataValue("language"),
        },
        lessons: lessonsWithProgress,
        totalLessons: lessons.length,
        accessibleLessons: lessons.length,
        hasFullAccess: true,
      },
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Get a specific lesson
export const getLesson = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { lessonId } = req.params;
    const userId = req.user?.id;

    const lesson = await Lesson.findOne({
      where: {
        id: lessonId,
        isActive: true,
      },
      include: [
        {
          model: Course,
          as: "course",
          attributes: ["id", "title", "language"],
        },
      ],
    });

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    // Get user progress for this lesson
    let userProgress = null;
    if (userId) {
      userProgress = await LessonProgress.findOne({
        where: {
          userId,
          lessonId,
        },
      });
    }

    // Update last accessed time if user is authenticated
    if (userId && userProgress) {
      await userProgress.update({
        lastAccessedAt: new Date(),
      });
    }

    const lessonData = lesson.toJSON();
    res.json({
      success: true,
      data: {
        ...lessonData,
        progress: userProgress?.toJSON() || null,
      },
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Create a new lesson (instructor only)
export const createLesson = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = checkAuth(req, res);
    if (!userId) return;

    const { courseId } = req.params;
    const { title, content, order, duration, resources } = req.body;

    // Validate required fields
    if (!title || !content || order === undefined) {
      return res.status(400).json({
        message: "Title, content, and order are required",
      });
    }

    // Check if user owns the course
    await checkCourseOwnership(courseId, userId);

    // Check if order is already taken
    const existingLesson = await Lesson.findOne({
      where: { courseId, order },
    });

    if (existingLesson) {
      return res.status(400).json({
        message: "A lesson with this order already exists",
      });
    }

    const lesson = await Lesson.create({
      courseId,
      title,
      content,
      order,
      duration,
      resources: resources ? JSON.stringify(resources) : undefined,
    });

    res.status(201).json({
      success: true,
      data: lesson,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Update a lesson (instructor only)
export const updateLesson = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = checkAuth(req, res);
    if (!userId) return;

    const { lessonId } = req.params;
    const updateData = req.body;

    const lesson = await Lesson.findByPk(lessonId, {
      include: [
        {
          model: Course,
          as: "course",
          attributes: ["id", "createdBy"],
        },
      ],
    });

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    // Check if user owns the course
    const courseData = (lesson as any).course;
    if (courseData.createdBy !== userId) {
      return res.status(403).json({
        message: "Only the instructor can update this lesson",
      });
    }

    // Handle resources field
    if (updateData.resources) {
      updateData.resources = JSON.stringify(updateData.resources);
    }

    await lesson.update(updateData);

    res.json({
      success: true,
      data: lesson,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Delete a lesson (instructor only)
export const deleteLesson = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = checkAuth(req, res);
    if (!userId) return;

    const { lessonId } = req.params;

    const lesson = await Lesson.findByPk(lessonId, {
      include: [
        {
          model: Course,
          as: "course",
          attributes: ["id", "createdBy"],
        },
      ],
    });

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    // Check if user owns the course
    const courseData = (lesson as any).course;
    if (courseData.createdBy !== userId) {
      return res.status(403).json({
        message: "Only the instructor can delete this lesson",
      });
    }

    // Soft delete by setting isActive to false
    await lesson.update({ isActive: false });

    res.json({
      success: true,
      message: "Lesson deleted successfully",
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Update lesson progress
export const updateLessonProgress = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    console.log("🔄 Updating lesson progress...");
    console.log("📝 Request body:", req.body);
    console.log("📝 Request params:", req.params);

    const userId = checkAuth(req, res);
    if (!userId) return;

    console.log("👤 User ID:", userId);

    const { lessonId } = req.params;
    const { isCompleted, timeSpent } = req.body;

    // Validate lesson exists
    const lesson = await Lesson.findByPk(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    // Find or create progress record
    const [progress, created] = await LessonProgress.findOrCreate({
      where: { userId, lessonId },
      defaults: {
        userId,
        lessonId,
        courseId: lesson.getDataValue("courseId"),
        isCompleted: false,
      },
    });

    // Update progress
    const updateData: any = {};
    if (isCompleted !== undefined) {
      updateData.isCompleted = isCompleted;
      if (isCompleted) {
        updateData.completedAt = new Date();
      } else {
        updateData.completedAt = null;
      }
    }

    if (timeSpent !== undefined) {
      updateData.timeSpent = timeSpent;
    }

    updateData.lastAccessedAt = new Date();

    console.log("📊 Update data:", updateData);
    console.log("📊 Progress record before update:", progress.toJSON());

    await progress.update(updateData);

    console.log("✅ Progress updated successfully");
    console.log("📊 Progress record after update:", progress.toJSON());

    res.json({
      success: true,
      data: progress,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Get user's course progress
export const getCourseProgress = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = checkAuth(req, res);
    if (!userId) return;

    const { courseId } = req.params;

    // Check if course exists
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Get all lessons for the course
    const lessons = await Lesson.findAll({
      where: {
        courseId,
        isActive: true,
      },
      order: [["order", "ASC"]],
      attributes: ["id", "title", "order"],
    });

    // Get user's progress for all lessons
    const progress = await LessonProgress.findAll({
      where: { userId, courseId },
      attributes: ["lessonId", "isCompleted", "completedAt", "timeSpent"],
    });

    // Calculate completion statistics
    const totalLessons = lessons.length;
    const completedLessons = progress.filter((p) =>
      p.getDataValue("isCompleted")
    ).length;
    const completionPercentage =
      totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

    // Create progress map
    const progressMap = progress.reduce((acc, p) => {
      acc[p.getDataValue("lessonId")] = p.toJSON();
      return acc;
    }, {} as Record<string, any>);

    // Add progress to lessons
    const lessonsWithProgress = lessons.map((lesson) => {
      const lessonData = lesson.toJSON();
      return {
        ...lessonData,
        progress: progressMap[lessonData.id] || null,
      };
    });

    res.json({
      success: true,
      data: {
        course: {
          id: course.getDataValue("id"),
          title: course.getDataValue("title"),
          language: course.getDataValue("language"),
        },
        lessons: lessonsWithProgress,
        progress: {
          totalLessons,
          completedLessons,
          completionPercentage,
        },
      },
    });
  } catch (error) {
    handleError(res, error);
  }
};
