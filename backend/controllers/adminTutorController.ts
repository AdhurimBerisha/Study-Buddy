import type { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/requireAuth";
import { Tutor, User, Course } from "../models";
import { handleError } from "../helpers/errorHelper";
import {
  checkAdminAuth,
  findEntityById,
  deleteEntityWithDependencyCheck,
  getTutorAttributes,
  sanitizeUserData,
  updateEntity,
  validateRequiredFields,
  checkEntityExists,
  sendSuccessResponse,
  sendErrorResponse,
  getPaginationParams,
  buildSearchWhereClause,
  listEntities,
  createPaginationResponse,
} from "../helpers/adminHelper";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";

const getAllTutors = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!checkAdminAuth(req, res)) return;

    const { page, limit } = getPaginationParams(req.query);
    const whereClause = buildSearchWhereClause(req.query.search as string, [
      "first_name",
      "last_name",
      "email",
    ]);

    if (req.query.expertise) {
      whereClause.expertise = { [Op.like]: `%${req.query.expertise}%` };
    }

    const { count, rows: tutors } = await listEntities(
      Tutor,
      whereClause,
      page,
      limit,
      undefined,
      getTutorAttributes()
    );

    res.json(createPaginationResponse(tutors, count, page, limit, "Tutors"));
  } catch (error) {
    handleError(res, error, "Error fetching tutors");
  }
};

const getTutorById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!checkAdminAuth(req, res)) return;

    const tutor = await findEntityById(
      Tutor,
      req.params.id,
      undefined,
      getTutorAttributes()
    );
    if (!tutor) return sendErrorResponse(res, "Tutor not found", 404);

    sendSuccessResponse(res, tutor);
  } catch (error) {
    handleError(res, error, "Error fetching tutor");
  }
};

const createTutor = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!checkAdminAuth(req, res)) return;

    const validation = validateRequiredFields(req.body, [
      "email",
      "password",
      "firstName",
      "lastName",
      "expertise",
    ]);
    if (!validation.isValid)
      return sendErrorResponse(res, validation.message, 400);

    const existingUser = await checkEntityExists(
      User,
      { email: req.body.email },
      "User with this email already exists"
    );
    if (existingUser.exists)
      return sendErrorResponse(res, existingUser.message, 409);

    const existingTutor = await checkEntityExists(
      Tutor,
      { email: req.body.email },
      "Tutor already exists"
    );
    if (existingTutor.exists)
      return sendErrorResponse(res, existingTutor.message, 409);

    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const user = await User.create({
      ...req.body,
      password: hashedPassword,
      role: "tutor",
    });
    const userData = sanitizeUserData(user);

    const tutor = await Tutor.create({
      userId: userData.id,
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      email: req.body.email,
      bio: req.body.bio || "",
      expertise: Array.isArray(req.body.expertise)
        ? req.body.expertise
        : [req.body.expertise],
      isVerified: false,
      avatar: req.body.avatar || null,
    });

    sendSuccessResponse(
      res,
      { user: userData, tutor },
      "Tutor created successfully",
      201
    );
  } catch (error) {
    handleError(res, error, "Error creating tutor");
  }
};

const updateTutor = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!checkAdminAuth(req, res)) return;

    const updateData = { ...req.body };
    const tutorUpdateData: any = {};

    [
      "first_name",
      "last_name",
      "email",
      "bio",
      "expertise",
      "isVerified",
      "avatar",
    ].forEach((field) => {
      if (updateData[field] !== undefined)
        tutorUpdateData[field] = updateData[field];
    });

    if (Object.keys(tutorUpdateData).length > 0) {
      const result = await updateEntity(
        Tutor,
        req.params.id,
        tutorUpdateData,
        "Tutor updated successfully",
        undefined,
        getTutorAttributes()
      );
      if (!result.success)
        return sendErrorResponse(res, result.message, result.status);
      sendSuccessResponse(res, result.data, result.message);
    } else {
      sendSuccessResponse(res, undefined, "No changes to update");
    }
  } catch (error) {
    handleError(res, error, "Error updating tutor");
  }
};

const deleteTutor = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!checkAdminAuth(req, res)) return;

    const result = await deleteEntityWithDependencyCheck(
      Tutor,
      req.params.id,
      Course,
      "tutorId",
      "Tutor"
    );
    if (!result.success)
      return sendErrorResponse(res, result.message, result.status);

    sendSuccessResponse(res, undefined, "Tutor deleted successfully");
  } catch (error) {
    handleError(res, error, "Error deleting tutor");
  }
};

export { getAllTutors, getTutorById, createTutor, updateTutor, deleteTutor };
