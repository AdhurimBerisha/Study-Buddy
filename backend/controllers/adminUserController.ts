import type { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/requireAuth";
import { User, Tutor, Purchase, Group } from "../models";
import { handleError } from "../helpers/errorHelper";
import {
  checkAdminAuth,
  findEntityById,
  deleteEntityWithDependencyCheck,
  sanitizeUserData,
  getUserAttributes,
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

const getAllUsers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!checkAdminAuth(req, res)) return;

    const { page, limit } = getPaginationParams(req.query);
    const whereClause = buildSearchWhereClause(
      req.query.search as string,
      ["firstName", "lastName", "email"],
      { role: "user" }
    );

    const { count, rows: users } = await listEntities(
      User,
      whereClause,
      page,
      limit,
      undefined,
      getUserAttributes()
    );

    res.json(createPaginationResponse(users, count, page, limit, "Users"));
  } catch (error) {
    handleError(res, error, "Error fetching users");
  }
};

const getUserById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!checkAdminAuth(req, res)) return;

    const { id } = req.params;
    if (!id) return sendErrorResponse(res, "User ID is required", 400);

    const user = await findEntityById(User, id, undefined, getUserAttributes());
    if (!user) return sendErrorResponse(res, "User not found", 404);

    sendSuccessResponse(res, user);
  } catch (error) {
    handleError(res, error, "Error fetching user");
  }
};

const createUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!checkAdminAuth(req, res)) return;

    const validation = validateRequiredFields(req.body, [
      "email",
      "password",
      "firstName",
      "lastName",
    ]);
    if (!validation.isValid)
      return sendErrorResponse(res, validation.message, 400);

    const existingUser = await checkEntityExists(
      User,
      { email: req.body.email },
      "User already exists"
    );
    if (existingUser.exists)
      return sendErrorResponse(res, existingUser.message, 409);

    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const userData = { ...req.body, password: hashedPassword };

    const user = await User.create(userData);
    const userPlain = sanitizeUserData(user);

    if (req.body.role === "tutor") {
      try {
        await Tutor.create({
          userId: userPlain.id,
          first_name: req.body.firstName,
          last_name: req.body.lastName,
          email: req.body.email,
          bio: "",
          expertise: [],
          isVerified: false,
          avatar: req.body.avatar || undefined,
        });
      } catch (tutorError) {
        console.error("Error creating tutor profile:", tutorError);
      }
    }

    sendSuccessResponse(res, userPlain, "User created successfully", 201);
  } catch (error) {
    handleError(res, error, "Error creating user");
  }
};

const updateUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!checkAdminAuth(req, res)) return;

    const updateData = { ...req.body };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 12);
    }

    const result = await updateEntity(
      User,
      req.params.id,
      updateData,
      "User updated successfully",
      undefined,
      getUserAttributes()
    );
    if (!result.success)
      return sendErrorResponse(res, result.message, result.status);

    sendSuccessResponse(res, result.data, result.message);
  } catch (error) {
    handleError(res, error, "Error updating user");
  }
};

const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!checkAdminAuth(req, res)) return;

    const result = await deleteEntityWithDependencyCheck(
      User,
      req.params.id,
      Purchase,
      "userId",
      "User"
    );
    if (!result.success)
      return sendErrorResponse(res, result.message, result.status);

    sendSuccessResponse(res, undefined, "User deleted successfully");
  } catch (error) {
    handleError(res, error, "Error deleting user");
  }
};

const changeUserRole = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!checkAdminAuth(req, res)) return;

    const validation = validateRequiredFields(req.body, ["role"]);
    if (!validation.isValid)
      return sendErrorResponse(res, validation.message, 400);

    const user = await User.findByPk(req.params.id);
    if (!user) return sendErrorResponse(res, "User not found", 404);

    await user.update({ role: req.body.role });

    if (req.body.role === "tutor") {
      const existingTutor = await Tutor.findOne({
        where: { userId: req.params.id },
      });
      if (!existingTutor) {
        try {
          await Tutor.create({
            userId: req.params.id,
            first_name: user.get("firstName") as string,
            last_name: user.get("lastName") as string,
            email: user.get("email") as string,
            bio: "",
            expertise: [],
            isVerified: false,
            avatar: (user.get("avatar") as string) || undefined,
          });
        } catch (tutorError) {
          console.error("Error creating tutor profile:", tutorError);
        }
      }
    }

    const updatedUser = await findEntityById(
      User,
      req.params.id,
      undefined,
      getUserAttributes()
    );
    sendSuccessResponse(res, updatedUser, "User role changed successfully");
  } catch (error) {
    handleError(res, error, "Error changing user role");
  }
};

const getAllGroups = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!checkAdminAuth(req, res)) return;

    const { page, limit } = getPaginationParams(req.query);
    const whereClause = buildSearchWhereClause(
      req.query.search as string,
      ["name", "description", "category"],
      {}
    );

    const { count, rows: groups } = await listEntities(
      Group,
      whereClause,
      page,
      limit,
      [
        {
          model: User,
          as: "creator",
          attributes: ["id", "firstName", "lastName", "email"],
        },
        {
          model: User,
          as: "members",
          attributes: ["id", "firstName", "lastName", "email"],
          through: {
            attributes: ["role", "joinedAt"],
          },
        },
      ],
      [
        "id",
        "name",
        "description",
        "category",
        "level",
        "maxMembers",
        "createdBy",
        "createdAt",
      ]
    );

    res.json(createPaginationResponse(groups, count, page, limit, "Groups"));
  } catch (error) {
    handleError(res, error, "Error fetching groups");
  }
};

export {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  changeUserRole,
  getAllGroups,
};
