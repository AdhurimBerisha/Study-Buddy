import type { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/requireAuth";
import { Lesson, Course } from "../models";
import { handleError } from "../helpers/errorHelper";
import {
  checkAdminAuth,
  findEntityById,
  getLessonIncludeOptions,
  createEntity,
  updateEntity,
  deleteEntity,
  validateRequiredFields,
  checkEntityExists,
  sendSuccessResponse,
  sendErrorResponse,
} from "../helpers/adminHelper";

const getLessonById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!checkAdminAuth(req, res)) return;

    const lesson = await findEntityById(
      Lesson,
      req.params.lessonId,
      getLessonIncludeOptions()
    );
    if (!lesson) return sendErrorResponse(res, "Lesson not found", 404);

    sendSuccessResponse(res, lesson);
  } catch (error) {
    handleError(res, error, "Error fetching lesson");
  }
};

const createLesson = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!checkAdminAuth(req, res)) return;

    const validation = validateRequiredFields(req.body, ["title", "content"]);
    if (!validation.isValid)
      return sendErrorResponse(res, validation.message, 400);

    const course = await Course.findByPk(req.params.courseId);
    if (!course) return sendErrorResponse(res, "Course not found", 404);

    const existingLesson = await checkEntityExists(
      Lesson,
      { courseId: req.params.courseId, order: req.body.order },
      "A lesson with this order already exists"
    );
    if (existingLesson.exists)
      return sendErrorResponse(res, existingLesson.message, 400);

    const lessonData = { ...req.body, courseId: req.params.courseId };
    if (req.body.resources)
      lessonData.resources = JSON.stringify(req.body.resources);

    const result = await createEntity(
      Lesson,
      lessonData,
      "Lesson created successfully"
    );
    sendSuccessResponse(res, result.data, result.message, 201);
  } catch (error) {
    handleError(res, error, "Error creating lesson");
  }
};

const updateLesson = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!checkAdminAuth(req, res)) return;

    const updateData = { ...req.body };
    if (updateData.resources)
      updateData.resources = JSON.stringify(updateData.resources);

    const result = await updateEntity(
      Lesson,
      req.params.lessonId,
      updateData,
      "Lesson updated successfully",
      getLessonIncludeOptions()
    );
    if (!result.success)
      return sendErrorResponse(res, result.message, result.status);

    sendSuccessResponse(res, result.data, result.message);
  } catch (error) {
    handleError(res, error, "Error updating lesson");
  }
};

const deleteLesson = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!checkAdminAuth(req, res)) return;

    const result = await deleteEntity(
      Lesson,
      req.params.lessonId,
      "Lesson deleted successfully"
    );
    if (!result.success)
      return sendErrorResponse(res, result.message, result.status);

    sendSuccessResponse(res, undefined, result.message);
  } catch (error) {
    handleError(res, error, "Error deleting lesson");
  }
};

export { getLessonById, createLesson, updateLesson, deleteLesson };
