import type { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/requireAuth";
import { Course, Lesson, User, Tutor, Purchase } from "../models";
import { handleError } from "../helpers/errorHelper";
import {
  checkAdminAuth,
  findEntityById,
  deleteEntityWithDependencyCheck,
  getCourseIncludeOptions,
  updateEntity,
  sendSuccessResponse,
  sendErrorResponse,
  getPaginationParams,
  buildSearchWhereClause,
  listEntities,
  createPaginationResponse,
} from "../helpers/adminHelper";

const getAllCourses = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!checkAdminAuth(req, res)) return;

    const { page, limit } = getPaginationParams(req.query);
    const whereClause = buildSearchWhereClause(req.query.search as string, [
      "title",
      "description",
    ]);

    if (req.query.category) whereClause.category = req.query.category;
    if (req.query.level) whereClause.level = req.query.level;

    const { count, rows: courses } = await listEntities(
      Course,
      whereClause,
      page,
      limit,
      getCourseIncludeOptions()
    );

    res.json(createPaginationResponse(courses, count, page, limit, "Courses"));
  } catch (error) {
    handleError(res, error, "Error fetching courses");
  }
};

const getCourseById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!checkAdminAuth(req, res)) return;

    const course = await findEntityById(Course, req.params.id, [
      ...getCourseIncludeOptions(),
      {
        model: Lesson,
        as: "lessons",
        attributes: ["id", "title", "order", "duration", "isActive"],
        order: [["order", "ASC"]],
      },
    ]);

    if (!course) return sendErrorResponse(res, "Course not found", 404);
    sendSuccessResponse(res, course);
  } catch (error) {
    handleError(res, error, "Error fetching course");
  }
};

const updateCourse = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!checkAdminAuth(req, res)) return;

    if (req.body.tutorId) {
      const user = await User.findByPk(req.body.tutorId);
      if (!user) return sendErrorResponse(res, "User not found", 404);

      const tutor = await Tutor.findOne({
        where: { userId: req.body.tutorId },
      });
      if (!tutor)
        return sendErrorResponse(
          res,
          "User does not have a tutor profile",
          404
        );
    }

    const result = await updateEntity(
      Course,
      req.params.id,
      req.body,
      "Course updated successfully",
      getCourseIncludeOptions()
    );
    if (!result.success)
      return sendErrorResponse(res, result.message, result.status);

    sendSuccessResponse(res, result.data, result.message);
  } catch (error) {
    handleError(res, error, "Error updating course");
  }
};

const deleteCourse = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!checkAdminAuth(req, res)) return;

    const result = await deleteEntityWithDependencyCheck(
      Course,
      req.params.id,
      Purchase,
      "courseId",
      "Course"
    );
    if (!result.success)
      return sendErrorResponse(res, result.message, result.status);

    sendSuccessResponse(res, undefined, "Course deleted successfully");
  } catch (error) {
    handleError(res, error, "Error deleting course");
  }
};

const getCourseLessons = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!checkAdminAuth(req, res)) return;

    const course = await Course.findByPk(req.params.courseId);
    if (!course) return sendErrorResponse(res, "Course not found", 404);

    const { page, limit } = getPaginationParams(req.query);
    const { count, rows: lessons } = await listEntities(
      Lesson,
      { courseId: req.params.courseId },
      page,
      limit,
      undefined,
      undefined,
      "order",
      "ASC"
    );

    res.json(createPaginationResponse(lessons, count, page, limit, "Lessons"));
  } catch (error) {
    handleError(res, error, "Error fetching lessons");
  }
};

export {
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCourseLessons,
};
