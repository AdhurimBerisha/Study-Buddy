import type { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/requireAuth";
import { User, Course, Lesson, Tutor, Purchase } from "../models";
import { handleError } from "../helpers/errorHelper";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";

const checkAdminAuth = (req: AuthenticatedRequest, res: Response) => {
  if (!req.user?.id) {
    res.status(401).json({ message: "User not authenticated" });
    return null;
  }

  if (req.user.role !== "admin") {
    res.status(403).json({ message: "Only admins can perform this action" });
    return null;
  }

  return req.user.id;
};

const getAllUsers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const adminId = checkAdminAuth(req, res);
    if (!adminId) return;

    const { page = 1, limit = 10, search, role } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const whereClause: any = {};

    if (search) {
      whereClause[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }

    whereClause.role = "user";

    const totalUsersCount = await User.count({ where: { role: "user" } });

    const filteredCount = await User.count({ where: whereClause });

    const { rows: users } = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
      limit: Number(limit),
      offset,
    });

    res.json({
      success: true,
      data: users,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(filteredCount / Number(limit)),
        totalUsers: totalUsersCount,
        filteredUsers: filteredCount,
        usersPerPage: Number(limit),
      },
    });
  } catch (error) {
    handleError(res, error, "Error fetching users");
  }
};

const getUserById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const adminId = checkAdminAuth(req, res);
    if (!adminId) return;

    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    handleError(res, error, "Error fetching user");
  }
};

const createUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const adminId = checkAdminAuth(req, res);
    if (!adminId) return;

    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      avatar,
      role = "user",
    } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        message: "Email, password, firstName, and lastName are required",
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone: phone || null,
      avatar: avatar || null,
      role,
    });

    const userPlain = user.get({ plain: true }) as any;
    delete userPlain.password;

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: userPlain,
    });
  } catch (error) {
    handleError(res, error, "Error creating user");
  }
};

const updateUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const adminId = checkAdminAuth(req, res);
    if (!adminId) return;

    const { id } = req.params;
    const updateData = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (id === adminId) {
      delete updateData.role;
    }

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 12);
    }

    await user.update(updateData);

    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    res.json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    handleError(res, error, "Error updating user");
  }
};

const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const adminId = checkAdminAuth(req, res);
    if (!adminId) return;

    const { id } = req.params;

    if (id === adminId) {
      return res.status(400).json({
        message: "You cannot delete your own account",
      });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const purchaseCount = await Purchase.count({ where: { userId: id } });

    if (purchaseCount > 0) {
      return res.status(400).json({
        message:
          "Cannot delete user with associated purchases. Consider deactivating instead.",
      });
    }

    await user.destroy();

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    handleError(res, error, "Error deleting user");
  }
};

const changeUserRole = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const adminId = checkAdminAuth(req, res);
    if (!adminId) return;

    const { id } = req.params;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({
        message: "Role is required",
      });
    }

    if (id === adminId) {
      return res.status(400).json({
        message: "You cannot change your own role",
      });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.update({ role });

    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    res.json({
      success: true,
      message: "User role changed successfully",
      data: updatedUser,
    });
  } catch (error) {
    handleError(res, error, "Error changing user role");
  }
};

const getAllCourses = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const adminId = checkAdminAuth(req, res);
    if (!adminId) return;

    const { page = 1, limit = 10, search, category, level } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const whereClause: any = {};

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (category) whereClause.category = category;
    if (level) whereClause.level = level;

    const { count, rows: courses } = await Course.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Tutor,
          as: "tutor",
          attributes: [
            "id",
            "first_name",
            "last_name",
            "email",
            "bio",
            "expertise",
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: Number(limit),
      offset,
    });

    res.json({
      success: true,
      data: courses,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(count / Number(limit)),
        totalCourses: count,
        coursesPerPage: Number(limit),
      },
    });
  } catch (error) {
    handleError(res, error, "Error fetching courses");
  }
};

const getCourseById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const adminId = checkAdminAuth(req, res);
    if (!adminId) return;

    const { id } = req.params;
    const course = await Course.findByPk(id, {
      include: [
        {
          model: Tutor,
          as: "tutor",
          attributes: [
            "id",
            "first_name",
            "last_name",
            "email",
            "bio",
            "expertise",
          ],
        },
        {
          model: Lesson,
          as: "lessons",
          attributes: ["id", "title", "order", "duration", "isActive"],
          order: [["order", "ASC"]],
        },
      ],
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({ success: true, data: course });
  } catch (error) {
    handleError(res, error, "Error fetching course");
  }
};

const createCourse = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const adminId = checkAdminAuth(req, res);
    if (!adminId) return;

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

    const tutor = await Tutor.findByPk(tutorId);
    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found" });
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
      tutorId,
    });

    const createdCourse = await Course.findByPk(course.get("id") as string, {
      include: [
        {
          model: Tutor,
          as: "tutor",
          attributes: [
            "id",
            "first_name",
            "last_name",
            "email",
            "bio",
            "expertise",
          ],
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

const updateCourse = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const adminId = checkAdminAuth(req, res);
    if (!adminId) return;

    const { id } = req.params;
    const updateData = req.body;

    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (updateData.tutorId) {
      const tutor = await Tutor.findByPk(updateData.tutorId);
      if (!tutor) {
        return res.status(404).json({ message: "Tutor not found" });
      }
    }

    await course.update(updateData);

    const updatedCourse = await Course.findByPk(id, {
      include: [
        {
          model: Tutor,
          as: "tutor",
          attributes: [
            "id",
            "first_name",
            "last_name",
            "email",
            "bio",
            "expertise",
          ],
        },
      ],
    });

    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    handleError(res, error, "Error updating course");
  }
};

const deleteCourse = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const adminId = checkAdminAuth(req, res);
    if (!adminId) return;

    const { id } = req.params;

    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const purchaseCount = await Purchase.count({ where: { courseId: id } });
    if (purchaseCount > 0) {
      return res.status(400).json({
        message:
          "Cannot delete course with existing purchases. Consider deactivating instead.",
      });
    }

    await course.destroy();

    res.json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    handleError(res, error, "Error deleting course");
  }
};

const getCourseLessons = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const adminId = checkAdminAuth(req, res);
    if (!adminId) return;

    const { courseId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const { count, rows: lessons } = await Lesson.findAndCountAll({
      where: { courseId },
      order: [["order", "ASC"]],
      limit: Number(limit),
      offset,
    });

    res.json({
      success: true,
      data: lessons,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(count / Number(limit)),
        totalLessons: count,
        lessonsPerPage: Number(limit),
      },
    });
  } catch (error) {
    handleError(res, error, "Error fetching lessons");
  }
};

const getLessonById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const adminId = checkAdminAuth(req, res);
    if (!adminId) return;

    const { lessonId } = req.params;
    const lesson = await Lesson.findByPk(lessonId, {
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

    res.json({ success: true, data: lesson });
  } catch (error) {
    handleError(res, error, "Error fetching lesson");
  }
};

const createLesson = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const adminId = checkAdminAuth(req, res);
    if (!adminId) return;

    const { courseId } = req.params;
    const { title, content, order, duration, resources } = req.body;

    if (!title || !content || order === undefined) {
      return res.status(400).json({
        message: "Title, content, and order are required",
      });
    }

    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

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
      message: "Lesson created successfully",
      data: lesson,
    });
  } catch (error) {
    handleError(res, error, "Error creating lesson");
  }
};

const updateLesson = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const adminId = checkAdminAuth(req, res);
    if (!adminId) return;

    const { lessonId } = req.params;
    const updateData = req.body;

    const lesson = await Lesson.findByPk(lessonId, {
      include: [
        {
          model: Course,
          as: "course",
          attributes: ["id", "title"],
        },
      ],
    });

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    if (updateData.resources) {
      updateData.resources = JSON.stringify(updateData.resources);
    }

    await lesson.update(updateData);

    res.json({
      success: true,
      message: "Lesson updated successfully",
      data: lesson,
    });
  } catch (error) {
    handleError(res, error, "Error updating lesson");
  }
};

const deleteLesson = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const adminId = checkAdminAuth(req, res);
    if (!adminId) return;

    const { lessonId } = req.params;

    const lesson = await Lesson.findByPk(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    await lesson.destroy();

    res.json({
      success: true,
      message: "Lesson deleted successfully",
    });
  } catch (error) {
    handleError(res, error, "Error deleting lesson");
  }
};

const getAllTutors = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const adminId = checkAdminAuth(req, res);
    if (!adminId) return;

    const { page = 1, limit = 10, search, expertise } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const whereClause: any = {};

    if (search) {
      whereClause[Op.or] = [
        { first_name: { [Op.iLike]: `%${search}%` } },
        { last_name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (expertise) {
      whereClause.expertise = { [Op.contains]: [expertise] };
    }

    const { count, rows: tutors } = await Tutor.findAndCountAll({
      where: whereClause,
      attributes: [
        "id",
        "first_name",
        "last_name",
        "email",
        "bio",
        "expertise",
        "rating",
        "totalStudents",
        "totalLessons",
        "isVerified",
        "avatar",
        "createdAt",
        "updatedAt",
      ],
      order: [["createdAt", "DESC"]],
      limit: Number(limit),
      offset,
    });

    res.json({
      success: true,
      data: tutors,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(count / Number(limit)),
        totalTutors: count,
        tutorsPerPage: Number(limit),
      },
    });
  } catch (error) {
    handleError(res, error, "Error fetching tutors");
  }
};

const getTutorById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const adminId = checkAdminAuth(req, res);
    if (!adminId) return;

    const { id } = req.params;
    const tutor = await Tutor.findByPk(id, {
      attributes: [
        "id",
        "first_name",
        "last_name",
        "email",
        "bio",
        "expertise",
        "rating",
        "totalStudents",
        "totalLessons",
        "isVerified",
        "avatar",
        "createdAt",
        "updatedAt",
      ],
    });

    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found" });
    }

    res.json({ success: true, data: tutor });
  } catch (error) {
    handleError(res, error, "Error fetching tutor");
  }
};

const createTutor = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const adminId = checkAdminAuth(req, res);
    if (!adminId) return;

    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      avatar,
      bio,
      expertise,
    } = req.body;

    if (!email || !password || !firstName || !lastName || !expertise) {
      return res.status(400).json({
        message:
          "Email, password, firstName, lastName, and expertise are required",
      });
    }

    const existingTutor = await Tutor.findOne({ where: { email } });
    if (existingTutor) {
      return res.status(409).json({ message: "Tutor already exists" });
    }

    const tutor = await Tutor.create({
      first_name: firstName,
      last_name: lastName,
      email: email,
      bio: bio || "",
      expertise: Array.isArray(expertise) ? expertise : [expertise],
      isVerified: false,
      avatar: avatar || null,
    });

    res.status(201).json({
      success: true,
      message: "Tutor created successfully",
      data: tutor,
    });
  } catch (error) {
    handleError(res, error, "Error creating tutor");
  }
};

const updateTutor = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const adminId = checkAdminAuth(req, res);
    if (!adminId) return;

    const { id } = req.params;
    const updateData = req.body;

    const tutor = await Tutor.findByPk(id);

    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found" });
    }

    const tutorUpdateData: any = {};
    if (updateData.first_name !== undefined)
      tutorUpdateData.first_name = updateData.first_name;
    if (updateData.last_name !== undefined)
      tutorUpdateData.last_name = updateData.last_name;
    if (updateData.email !== undefined)
      tutorUpdateData.email = updateData.email;
    if (updateData.bio !== undefined) tutorUpdateData.bio = updateData.bio;
    if (updateData.expertise !== undefined)
      tutorUpdateData.expertise = updateData.expertise;
    if (updateData.isVerified !== undefined)
      tutorUpdateData.isVerified = updateData.isVerified;
    if (updateData.avatar !== undefined)
      tutorUpdateData.avatar = updateData.avatar;

    if (Object.keys(tutorUpdateData).length > 0) {
      await tutor.update(tutorUpdateData);
    }

    const updatedTutor = await Tutor.findByPk(id, {
      attributes: [
        "id",
        "first_name",
        "last_name",
        "email",
        "bio",
        "expertise",
        "rating",
        "totalStudents",
        "totalLessons",
        "isVerified",
        "avatar",
        "createdAt",
        "updatedAt",
      ],
    });

    res.json({
      success: true,
      message: "Tutor updated successfully",
      data: updatedTutor,
    });
  } catch (error) {
    handleError(res, error, "Error updating tutor");
  }
};

const deleteTutor = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const adminId = checkAdminAuth(req, res);
    if (!adminId) return;

    const { id } = req.params;

    const tutor = await Tutor.findByPk(id);

    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found" });
    }

    const courseCount = await Course.count({ where: { tutorId: id } });
    if (courseCount > 0) {
      return res.status(400).json({
        message:
          "Cannot delete tutor with associated courses. Consider deactivating instead.",
      });
    }

    await tutor.destroy();

    res.json({
      success: true,
      message: "Tutor deleted successfully",
    });
  } catch (error) {
    handleError(res, error, "Error deleting tutor");
  }
};

const getDashboardStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const adminId = checkAdminAuth(req, res);
    if (!adminId) return;

    const totalUsers = await User.count();
    const regularUsers = await User.count({
      where: { role: "user" },
    });
    const adminUsers = await User.count({ where: { role: "admin" } });

    const totalTutors = await Tutor.count();

    const totalCourses = await Course.count();

    const totalLessons = await Lesson.count();

    const totalPurchases = await Purchase.count();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentUsers = await User.count({
      where: { createdAt: { [Op.gte]: sevenDaysAgo } },
    });

    const recentCourses = await Course.count({
      where: { createdAt: { [Op.gte]: sevenDaysAgo } },
    });

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          regular: regularUsers,
          admin: adminUsers,
          recent: recentUsers,
        },
        tutors: {
          total: totalTutors,
        },
        courses: {
          total: totalCourses,
          recent: recentCourses,
        },
        lessons: {
          total: totalLessons,
        },
        purchases: {
          total: totalPurchases,
        },
      },
    });
  } catch (error) {
    handleError(res, error, "Error fetching dashboard statistics");
  }
};

export {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  changeUserRole,
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseLessons,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
  getAllTutors,
  getTutorById,
  createTutor,
  updateTutor,
  deleteTutor,
  getDashboardStats,
};
