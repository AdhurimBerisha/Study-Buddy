import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import {
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
} from "../controllers/adminController";

const router = Router();

// All admin routes require authentication
router.use(requireAuth);

// ==================== DASHBOARD ====================
router.get("/dashboard/stats", getDashboardStats);

// ==================== USER MANAGEMENT ====================
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.patch("/users/:id/role", changeUserRole);

// ==================== COURSE MANAGEMENT ====================
router.get("/courses", getAllCourses);
router.get("/courses/:id", getCourseById);
router.post("/courses", createCourse);
router.put("/courses/:id", updateCourse);
router.delete("/courses/:id", deleteCourse);

// ==================== LESSON MANAGEMENT ====================
router.get("/courses/:courseId/lessons", getCourseLessons);
router.get("/lessons/:lessonId", getLessonById);
router.post("/courses/:courseId/lessons", createLesson);
router.put("/lessons/:lessonId", updateLesson);
router.delete("/lessons/:lessonId", deleteLesson);

// ==================== TUTOR MANAGEMENT ====================
router.get("/tutors", getAllTutors);
router.get("/tutors/:id", getTutorById);
router.post("/tutors", createTutor);
router.put("/tutors/:id", updateTutor);
router.delete("/tutors/:id", deleteTutor);

export default router;
