import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  changeUserRole,
  getAllCourses,
  getCourseById,
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
} from "../controllers/adminController";

const router = Router();

router.use(requireAuth);

router.get("/dashboard/stats", getDashboardStats);

router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.put("/users/:id/role", changeUserRole);

router.get("/courses", getAllCourses);
router.get("/courses/:id", getCourseById);

router.put("/courses/:id", updateCourse);
router.delete("/courses/:id", deleteCourse);

router.get("/courses/:courseId/lessons", getCourseLessons);
router.get("/lessons/:lessonId", getLessonById);
router.post("/courses/:courseId/lessons", createLesson);
router.put("/lessons/:lessonId", updateLesson);
router.delete("/lessons/:lessonId", deleteLesson);

router.get("/tutors", getAllTutors);
router.get("/tutors/:id", getTutorById);
router.post("/tutors", createTutor);
router.put("/tutors/:id", updateTutor);
router.delete("/tutors/:id", deleteTutor);

export default router;
