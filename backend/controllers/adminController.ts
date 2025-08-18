import type { Request, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/requireAuth";
import { User, Course, Lesson, Tutor, Purchase } from "../models";
import { handleError } from "../helpers/errorHelper";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";

// Helper function to check if user is admin
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

// ==================== USER MANAGEMENT ====================

// Get all users with pagination and filtering
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

    // Always filter to only show regular users (role: "user")
    whereClause.role = "user";

    // Get total count of regular users only
    const totalUsersCount = await User.count({ where: { role: "user" } });

    // Get filtered count (for pagination)
    const filteredCount = await User.count({ where: whereClause });

    // Get paginated users
    const { rows: users } = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Tutor,
          as: "tutorProfile",
          attributes: ["id", "bio", "expertise", "hourlyRate", "isVerified"],
          required: false,
        },
      ],
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
        totalUsers: totalUsersCount, // Total users in database
        filteredUsers: filteredCount, // Users matching current filters
        usersPerPage: Number(limit),
      },
    });
  } catch (error) {
    handleError(res, error, "Error fetching users");
  }
};

// Get single user by ID
const getUserById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const adminId = checkAdminAuth(req, res);
    if (!adminId) return;

    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Tutor,
          as: "tutorProfile",
          attributes: ["id", "bio", "expertise", "hourlyRate", "isVerified"],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    handleError(res, error, "Error fetching user");
  }
};

// Create new user (admin can create any type of user)
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

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        message: "Email, password, firstName, and lastName are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone: phone || null,
      avatar: avatar || null,
      role,
    });

    // If creating a tutor, also create tutor profile
    if (role === "tutor") {
      await Tutor.create({
        userId: (user as any).id,
        bio: "",
        expertise: [],
        hourlyRate: 0,
        isVerified: false,
      });
    }

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

// Update user
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

    // Prevent admin from changing their own role
    if (id === adminId) {
      delete updateData.role;
    }

    // Hash password if provided
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 12);
    }

    // Update user
    await user.update(updateData);

    // Handle tutor profile creation/deletion based on role changes
    if (updateData.role) {
      const existingTutor = await Tutor.findOne({ where: { userId: id } });

      if (updateData.role === "tutor" && !existingTutor) {
        // Create tutor profile
        await Tutor.create({
          userId: id,
          bio: "",
          expertise: [],
          hourlyRate: 0,
          isVerified: false,
        });
      } else if (updateData.role !== "tutor" && existingTutor) {
        // Delete tutor profile
        await existingTutor.destroy();
      }
    }

    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Tutor,
          as: "tutorProfile",
          attributes: ["id", "bio", "expertise", "hourlyRate", "isVerified"],
        },
      ],
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

// Delete user
const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const adminId = checkAdminAuth(req, res);
    if (!adminId) return;

    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (id === adminId) {
      return res.status(400).json({
        message: "You cannot delete your own account",
      });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user has associated data
    const courseCount = await Course.count({ where: { createdBy: id } });
    const purchaseCount = await Purchase.count({ where: { userId: id } });

    if (courseCount > 0 || purchaseCount > 0) {
      return res.status(400).json({
        message:
          "Cannot delete user with associated courses or purchases. Consider deactivating instead.",
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

// Change user role
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

    // Prevent admin from changing their own role
    if (id === adminId) {
      return res.status(400).json({
        message: "You cannot change your own role",
      });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user role
    await user.update({ role });

    // Handle tutor profile
    const existingTutor = await Tutor.findOne({ where: { userId: id } });

    if (role === "tutor" && !existingTutor) {
      // Create tutor profile
      await Tutor.create({
        userId: id,
        bio: "",
        expertise: [],
        hourlyRate: 0,
        isVerified: false,
      });
    } else if (role !== "tutor" && existingTutor) {
      // Delete tutor profile
      await existingTutor.destroy();
    }

    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Tutor,
          as: "tutorProfile",
          attributes: ["id", "bio", "expertise", "hourlyRate", "isVerified"],
        },
      ],
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

// ==================== COURSE MANAGEMENT ====================

// Get all courses with pagination and filtering
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
          model: User,
          as: "instructor",
          attributes: ["id", "firstName", "lastName", "email"],
        },
        {
          model: Tutor,
          as: "tutor",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "firstName", "lastName", "email"],
            },
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

// Get single course by ID
const getCourseById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const adminId = checkAdminAuth(req, res);
    if (!adminId) return;

    const { id } = req.params;
    const course = await Course.findByPk(id, {
      include: [
        {
          model: User,
          as: "instructor",
          attributes: ["id", "firstName", "lastName", "email"],
        },
        {
          model: Tutor,
          as: "tutor",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "firstName", "lastName", "email"],
            },
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

// Create course (admin can create courses for any tutor)
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
      createdBy,
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

    // Verify tutor exists
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
      createdBy: createdBy || (tutor as any).userId, // Use provided createdBy or tutor's userId
      tutorId,
    });

    const createdCourse = await Course.findByPk(course.get("id") as string, {
      include: [
        {
          model: User,
          as: "instructor",
          attributes: ["id", "firstName", "lastName", "email"],
        },
        {
          model: Tutor,
          as: "tutor",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "firstName", "lastName", "email"],
            },
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

// Update course
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

    // If changing tutorId, verify new tutor exists
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
          model: User,
          as: "instructor",
          attributes: ["id", "firstName", "lastName", "email"],
        },
        {
          model: Tutor,
          as: "tutor",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "firstName", "lastName", "email"],
            },
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

// Delete course
const deleteCourse = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const adminId = checkAdminAuth(req, res);
    if (!adminId) return;

    const { id } = req.params;

    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if course has purchases
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

// ==================== LESSON MANAGEMENT ====================

// Get all lessons for a course
const getCourseLessons = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const adminId = checkAdminAuth(req, res);
    if (!adminId) return;

    const { courseId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    // Verify course exists
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

// Get single lesson by ID
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

// Create lesson
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

    // Verify course exists
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if lesson order already exists
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

// Update lesson
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

    // Handle resources JSON serialization
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

// Delete lesson
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

// ==================== TUTOR MANAGEMENT ====================

// Get all tutors with pagination and filtering
const getAllTutors = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const adminId = checkAdminAuth(req, res);
    if (!adminId) return;

    const { page = 1, limit = 10, search, expertise } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const whereClause: any = {};

    if (search) {
      whereClause[Op.or] = [
        { "$user.firstName$": { [Op.iLike]: `%${search}%` } },
        { "$user.lastName$": { [Op.iLike]: `%${search}%` } },
        { "$user.email$": { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (expertise) {
      whereClause.expertise = { [Op.contains]: [expertise] };
    }

    const { count, rows: tutors } = await Tutor.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "user",
          attributes: [
            "id",
            "firstName",
            "lastName",
            "email",
            "phone",
            "avatar",
          ],
          where: { role: "tutor" }, // Ensure only users with tutor role
        },
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

// Get single tutor by ID
const getTutorById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const adminId = checkAdminAuth(req, res);
    if (!adminId) return;

    const { id } = req.params;
    const tutor = await Tutor.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: [
            "id",
            "firstName",
            "lastName",
            "email",
            "phone",
            "avatar",
          ],
        },
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

// Create new tutor (admin can create tutor accounts)
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
      hourlyRate,
    } = req.body;

    // Validate required fields
    if (
      !email ||
      !password ||
      !firstName ||
      !lastName ||
      !expertise ||
      !hourlyRate
    ) {
      return res.status(400).json({
        message:
          "Email, password, firstName, lastName, expertise, and hourlyRate are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with tutor role
    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone: phone || null,
      avatar: avatar || null,
      role: "tutor",
    });

    // Create tutor profile
    const tutor = await Tutor.create({
      userId: (user as any).id,
      bio: bio || "",
      expertise: Array.isArray(expertise) ? expertise : [expertise],
      hourlyRate: Number(hourlyRate),
      isVerified: false,
    });

    const createdTutor = await Tutor.findByPk(tutor.get("id") as string, {
      include: [
        {
          model: User,
          as: "user",
          attributes: [
            "id",
            "firstName",
            "lastName",
            "email",
            "phone",
            "avatar",
          ],
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Tutor created successfully",
      data: createdTutor,
    });
  } catch (error) {
    handleError(res, error, "Error creating tutor");
  }
};

// Update tutor
const updateTutor = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const adminId = checkAdminAuth(req, res);
    if (!adminId) return;

    const { id } = req.params;
    const updateData = req.body;

    const tutor = await Tutor.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
        },
      ],
    });

    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found" });
    }

    // Update user data if provided
    if (
      updateData.firstName ||
      updateData.lastName ||
      updateData.phone ||
      updateData.avatar
    ) {
      await (tutor as any).user.update({
        firstName: updateData.firstName,
        lastName: updateData.lastName,
        phone: updateData.phone,
        avatar: updateData.avatar,
      });
    }

    // Update tutor profile data
    const tutorUpdateData: any = {};
    if (updateData.bio !== undefined) tutorUpdateData.bio = updateData.bio;
    if (updateData.expertise !== undefined)
      tutorUpdateData.expertise = updateData.expertise;
    if (updateData.hourlyRate !== undefined)
      tutorUpdateData.hourlyRate = updateData.hourlyRate;
    if (updateData.isVerified !== undefined)
      tutorUpdateData.isVerified = updateData.isVerified;

    if (Object.keys(tutorUpdateData).length > 0) {
      await tutor.update(tutorUpdateData);
    }

    const updatedTutor = await Tutor.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: [
            "id",
            "firstName",
            "lastName",
            "email",
            "phone",
            "avatar",
          ],
        },
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

// Delete tutor
const deleteTutor = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const adminId = checkAdminAuth(req, res);
    if (!adminId) return;

    const { id } = req.params;

    const tutor = await Tutor.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
        },
      ],
    });

    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found" });
    }

    // Check if tutor has associated courses
    const courseCount = await Course.count({ where: { tutorId: id } });
    if (courseCount > 0) {
      return res.status(400).json({
        message:
          "Cannot delete tutor with associated courses. Consider deactivating instead.",
      });
    }

    // Delete tutor profile first
    await tutor.destroy();

    // Delete associated user account
    await (tutor as any).user.destroy();

    res.json({
      success: true,
      message: "Tutor deleted successfully",
    });
  } catch (error) {
    handleError(res, error, "Error deleting tutor");
  }
};

// ==================== DASHBOARD STATISTICS ====================

// Get admin dashboard statistics
const getDashboardStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const adminId = checkAdminAuth(req, res);
    if (!adminId) return;

    // Count users by role
    const totalUsers = await User.count();
    const regularUsers = await User.count({
      where: { role: "user" },
    });
    const adminUsers = await User.count({ where: { role: "admin" } });
    const tutorUsers = await User.count({ where: { role: "tutor" } });

    // Count courses
    const totalCourses = await Course.count();

    // Count lessons
    const totalLessons = await Lesson.count();

    // Count purchases
    const totalPurchases = await Purchase.count();

    // Recent activity (last 7 days)
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
          tutor: tutorUsers,
          recent: recentUsers,
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
  // User Management
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  changeUserRole,

  // Course Management
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,

  // Lesson Management
  getCourseLessons,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,

  // Tutor Management
  getAllTutors,
  getTutorById,
  createTutor,
  updateTutor,
  deleteTutor,

  // Dashboard
  getDashboardStats,
};
