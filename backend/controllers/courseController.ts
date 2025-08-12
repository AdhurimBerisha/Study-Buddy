import type { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/requireAuth";
import { Course, CourseEnrollment, User } from "../models";
import { handleError } from "../helpers/errorHelper";
import sequelize from "../config/db";
import { Op } from "sequelize";

export const listCourses = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { category, level, search } = req.query;
    const userId = req.user?.id;

    const whereClause: any = {};

    if (category) {
      whereClause.category = category;
    }

    if (level) {
      whereClause.level = level;
    }

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { language: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const courses = await Course.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "instructor",
          attributes: ["id", "firstName", "lastName", "avatar"],
          required: false,
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const coursesWithEnrollment = await Promise.all(
      courses.map(async (course) => {
        const courseData = course.toJSON();

        const enrollmentCount = await CourseEnrollment.count({
          where: { courseId: courseData.id },
        });

        let isEnrolled = false;
        if (userId) {
          const enrollment = await CourseEnrollment.findOne({
            where: { courseId: courseData.id, userId },
          });
          isEnrolled = !!enrollment;
        }

        return {
          ...courseData,
          enrollmentCount,
          isEnrolled,
        };
      })
    );

    return res.json(coursesWithEnrollment);
  } catch (error) {
    return handleError(res, error, "Error fetching courses");
  }
};

export const getCourse = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const course = await Course.findByPk(id, {
      include: [
        {
          model: User,
          as: "instructor",
          attributes: ["id", "firstName", "lastName", "avatar"],
          required: false,
        },
      ],
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const enrollmentCount = await CourseEnrollment.count({
      where: { courseId: id },
    });

    let isEnrolled = false;
    let enrollmentData = null;
    if (userId) {
      const enrollment = await CourseEnrollment.findOne({
        where: { courseId: id, userId },
      });
      if (enrollment) {
        isEnrolled = true;
        enrollmentData = enrollment.toJSON();
      }
    }

    const courseData = {
      ...course.toJSON(),
      enrollmentCount,
      isEnrolled,
      enrollment: enrollmentData,
    };

    return res.json(courseData);
  } catch (error) {
    return handleError(res, error, "Error fetching course");
  }
};

export const createCourse = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
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
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

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
      include: [
        {
          model: User,
          as: "instructor",
          attributes: ["id", "firstName", "lastName", "avatar"],
        },
      ],
    });

    return res.status(201).json(createdCourse);
  } catch (error) {
    return handleError(res, error, "Error creating course");
  }
};

export const updateCourse = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const updateData = req.body;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const courseData = course.toJSON();
    if (courseData.createdBy !== userId) {
      return res
        .status(403)
        .json({ message: "Only the instructor can update this course" });
    }

    await course.update(updateData);

    const updatedCourse = await Course.findByPk(id, {
      include: [
        {
          model: User,
          as: "instructor",
          attributes: ["id", "firstName", "lastName", "avatar"],
        },
      ],
    });

    return res.json(updatedCourse);
  } catch (error) {
    return handleError(res, error, "Error updating course");
  }
};

export const deleteCourse = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const courseData = course.toJSON();
    if (courseData.createdBy !== userId) {
      return res
        .status(403)
        .json({ message: "Only the instructor can delete this course" });
    }

    await sequelize.transaction(async (t) => {
      await CourseEnrollment.destroy({
        where: { courseId: id },
        transaction: t,
      });
      await course.destroy({ transaction: t });
    });

    return res.json({ message: "Course deleted successfully" });
  } catch (error) {
    return handleError(res, error, "Error deleting course");
  }
};

export const enrollInCourse = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const existingEnrollment = await CourseEnrollment.findOne({
      where: { courseId: id, userId },
    });

    if (existingEnrollment) {
      return res
        .status(400)
        .json({ message: "Already enrolled in this course" });
    }

    await CourseEnrollment.create({
      courseId: id,
      userId,
    });

    return res.json({ message: "Successfully enrolled in the course" });
  } catch (error) {
    return handleError(res, error, "Error enrolling in course");
  }
};

export const unenrollFromCourse = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const enrollment = await CourseEnrollment.findOne({
      where: { courseId: id, userId },
    });

    if (!enrollment) {
      return res.status(400).json({ message: "Not enrolled in this course" });
    }

    await enrollment.destroy();

    return res.json({ message: "Successfully unenrolled from the course" });
  } catch (error) {
    return handleError(res, error, "Error unenrolling from course");
  }
};

export const getMyCourses = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const enrollments = await CourseEnrollment.findAll({
      where: { userId },
      include: [
        {
          model: Course,
          as: "course",
          include: [
            {
              model: User,
              as: "instructor",
              attributes: ["id", "firstName", "lastName", "avatar"],
              required: false,
            },
          ],
        },
      ],
      order: [["enrolledAt", "DESC"]],
    });

    const myCourses = enrollments.map((enrollment) => {
      const enrollmentData = enrollment.toJSON();
      const courseData = (enrollmentData as any).course;
      return {
        ...courseData,
        enrollment: {
          progress: enrollmentData.progress,
          enrolledAt: enrollmentData.enrolledAt,
          completedAt: enrollmentData.completedAt,
          lastAccessedAt: enrollmentData.lastAccessedAt,
        },
      };
    });

    return res.json(myCourses);
  } catch (error) {
    return handleError(res, error, "Error fetching enrolled courses");
  }
};

export const updateCourseProgress = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { progress } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (typeof progress !== "number" || progress < 0 || progress > 100) {
      return res
        .status(400)
        .json({ message: "Progress must be a number between 0 and 100" });
    }

    const enrollment = await CourseEnrollment.findOne({
      where: { courseId: id, userId },
    });

    if (!enrollment) {
      return res.status(400).json({ message: "Not enrolled in this course" });
    }

    const updateData: any = {
      progress,
      lastAccessedAt: new Date(),
    };

    if (progress === 100) {
      updateData.completedAt = new Date();
    }

    await enrollment.update(updateData);

    return res.json({ message: "Progress updated successfully" });
  } catch (error) {
    return handleError(res, error, "Error updating course progress");
  }
};
