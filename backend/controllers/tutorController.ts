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

    let whereClause: any = {};

    if (category) {
      console.log(
        `Searching for tutors who have courses in category: ${category}`
      );

      // First, find courses in this category
      const coursesInCategory = await Course.findAll({
        where: { category: category as string },
        attributes: ["tutorId"],
        raw: true,
      });

      // Debug: check the actual field names returned
      console.log("Sample course data:", coursesInCategory[0]);
      console.log("All course data:", coursesInCategory);

      if (coursesInCategory.length > 0) {
        // Debug: log the raw course data
        console.log(
          "Raw courses data:",
          JSON.stringify(coursesInCategory, null, 2)
        );

        // Check what fields are actually available
        if (coursesInCategory.length > 0) {
          const firstCourse = coursesInCategory[0] as any;
          console.log("Available fields in course:", Object.keys(firstCourse));
          console.log("tutorId value:", firstCourse.tutorId);
          console.log("tutor_id value:", firstCourse.tutor_id);
        }

        // Get unique tutor IDs from courses
        // Try both field names since raw queries might return different field names
        const tutorIds = [
          ...new Set(
            coursesInCategory.map((c: any) => c.tutorId || c.tutor_id)
          ),
        ];
        console.log(
          `Found ${tutorIds.length} tutors with courses in category: ${category}`
        );
        console.log("Tutor IDs extracted:", tutorIds);

        // Check if tutorIds array is valid
        if (tutorIds.length === 0 || tutorIds.some((id) => !id)) {
          console.log("Warning: No valid tutor IDs found in courses");
          return res.json({
            tutors: [],
            total: 0,
            limit: Number(limit),
            offset: Number(offset),
          });
        }

        // Find tutors by their userId (which is the tutorId in courses)
        console.log("Op.in value:", Op.in);
        console.log("tutorIds array:", tutorIds);

        // Use Sequelize with proper associations instead of raw SQL
        console.log("Using Sequelize with associations...");

        // Build the where clause without verification filter
        const whereClause: any = {
          userId: { [Op.in]: tutorIds },
        };

        console.log(
          "Sequelize where clause:",
          JSON.stringify(whereClause, null, 2)
        );

        // Find tutors using Sequelize with proper where clause
        const tutors = await Tutor.findAndCountAll({
          where: whereClause,
          limit: Number(limit),
          offset: Number(offset),
          order: [["createdAt", "DESC"]],
        });

        console.log(`Found ${tutors.count} tutors using Sequelize`);

        return res.json({
          tutors: tutors.rows,
          total: tutors.count,
          limit: Number(limit),
          offset: Number(offset),
        });
      } else {
        console.log(`No courses found in category: ${category}`);
        return res.json({
          tutors: [],
          total: 0,
          limit: Number(limit),
          offset: Number(offset),
        });
      }
    }

    // If no category search, use regular Sequelize query
    if (!category) {
      console.log(
        "Searching tutors with where clause:",
        JSON.stringify(whereClause, null, 2)
      );

      const tutors = await Tutor.findAndCountAll({
        where: whereClause,
        limit: Number(limit),
        offset: Number(offset),
        order: [["createdAt", "DESC"]],
      });

      console.log(`Found ${tutors.count} tutors`);

      return res.json({
        tutors: tutors.rows,
        total: tutors.count,
        limit: Number(limit),
        offset: Number(offset),
      });
    }
  } catch (error) {
    console.error("Error in getAllTutors:", error);
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
        message: "Title, description, category, and level are required",
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
