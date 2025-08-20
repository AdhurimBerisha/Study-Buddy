import type { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/requireAuth";
import { Lesson, Course, LessonProgress } from "../models";
import { handleError } from "../helpers/errorHelper";
import { Op } from "sequelize";

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
  if (courseData.tutorId !== userId) {
    throw new Error("Only the instructor can perform this action");
  }
  return course;
};

const getCourseLessons = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { courseId } = req.params;
    const userId = req.user?.id;

    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

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

const getLesson = async (req: AuthenticatedRequest, res: Response) => {
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

    let userProgress = null;
    if (userId) {
      userProgress = await LessonProgress.findOne({
        where: {
          userId,
          lessonId,
        },
      });
    }

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

const createLesson = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = checkAuth(req, res);
    if (!userId) return;

    const { courseId } = req.params;
    const { title, content, order, duration, resources } = req.body;

    if (!title || !content || order === undefined) {
      return res.status(400).json({
        message: "Title, content, and order are required",
      });
    }

    await checkCourseOwnership(courseId, userId);

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

const updateLesson = async (req: AuthenticatedRequest, res: Response) => {
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

    const courseData = (lesson as any).course;
    if (courseData.createdBy !== userId) {
      return res.status(403).json({
        message: "Only the instructor can update this lesson",
      });
    }

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

const deleteLesson = async (req: AuthenticatedRequest, res: Response) => {
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

    const courseData = (lesson as any).course;
    if (courseData.createdBy !== userId) {
      return res.status(403).json({
        message: "Only the instructor can delete this lesson",
      });
    }

    await lesson.update({ isActive: false });

    res.json({
      success: true,
      message: "Lesson deleted successfully",
    });
  } catch (error) {
    handleError(res, error);
  }
};

const updateLessonProgress = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = checkAuth(req, res);
    if (!userId) return;

    const { lessonId } = req.params;
    const { isCompleted, timeSpent } = req.body;

    const lesson = await Lesson.findByPk(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    const [progress, created] = await LessonProgress.findOrCreate({
      where: { userId, lessonId },
      defaults: {
        userId,
        lessonId,
        courseId: lesson.getDataValue("courseId"),
        isCompleted: false,
      },
    });

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

    await progress.update(updateData);

    res.json({
      success: true,
      data: progress,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const getCourseProgress = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = checkAuth(req, res);
    if (!userId) return;

    const { courseId } = req.params;

    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const lessons = await Lesson.findAll({
      where: {
        courseId,
        isActive: true,
      },
      order: [["order", "ASC"]],
      attributes: ["id", "title", "order"],
    });

    const progress = await LessonProgress.findAll({
      where: { userId, courseId },
      attributes: ["lessonId", "isCompleted", "completedAt", "timeSpent"],
    });

    const totalLessons = lessons.length;
    const completedLessons = progress.filter((p) =>
      p.getDataValue("isCompleted")
    ).length;
    const completionPercentage =
      totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

    const progressMap = progress.reduce((acc, p) => {
      acc[p.getDataValue("lessonId")] = p.toJSON();
      return acc;
    }, {} as Record<string, any>);

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

export {
  getCourseLessons,
  getLesson,
  createLesson,
  updateLesson,
  deleteLesson,
  updateLessonProgress,
  getCourseProgress,
};
