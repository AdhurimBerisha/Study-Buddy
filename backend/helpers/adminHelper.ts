import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/requireAuth";
import { User, Course, Lesson, Tutor, Purchase } from "../models";
import { Op } from "sequelize";

export const checkAdminAuth = (
  req: AuthenticatedRequest,
  res: Response
): boolean => {
  if (!req.user?.id) {
    res.status(401).json({ message: "User not authenticated" });
    return false;
  }

  if (req.user.role !== "admin") {
    res.status(403).json({ message: "Only admins can perform this action" });
    return false;
  }

  return true;
};

export const createPaginationResponse = (
  data: any[],
  count: number,
  page: number,
  limit: number,
  entityName: string
) => {
  return {
    success: true,
    data,
    pagination: {
      currentPage: Number(page),
      totalPages: Math.ceil(count / Number(limit)),
      [`total${entityName}`]: count,
      [`${entityName.toLowerCase()}PerPage`]: Number(limit),
    },
  };
};

export const buildSearchWhereClause = (
  search: string | undefined,
  searchFields: string[],
  additionalFilters: Record<string, any> = {}
) => {
  const whereClause: any = { ...additionalFilters };

  if (search) {
    whereClause[Op.or] = searchFields.map((field) => ({
      [field]: { [Op.like]: `%${search}%` },
    }));
  }

  return whereClause;
};

export const findEntityById = async (
  model: any,
  id: string,
  includeOptions?: any,
  attributes?: any
) => {
  const options: any = {};
  if (includeOptions) options.include = includeOptions;
  if (attributes) options.attributes = attributes;

  return await model.findByPk(id, options);
};

export const deleteEntityWithDependencyCheck = async (
  model: any,
  id: string,
  dependencyModel: any,
  dependencyField: string,
  dependencyName: string
) => {
  const entity = await model.findByPk(id);
  if (!entity) {
    return {
      success: false,
      status: 404,
      message: `${dependencyName} not found`,
    };
  }

  const dependencyCount = await dependencyModel.count({
    where: { [dependencyField]: id },
  });

  if (dependencyCount > 0) {
    return {
      success: false,
      status: 400,
      message: `Cannot delete ${dependencyName.toLowerCase()} with associated ${dependencyName.toLowerCase()}s. Consider deactivating instead.`,
    };
  }

  await entity.destroy();
  return { success: true, status: 200, message: "Entity deleted successfully" };
};

export const sanitizeUserData = (user: any) => {
  const userData = user.get({ plain: true });
  delete userData.password;
  return userData;
};

export const getCourseIncludeOptions = () => [
  {
    model: User,
    as: "tutor",
    attributes: ["id", "firstName", "lastName", "email"],
  },
];

export const getLessonIncludeOptions = () => [
  {
    model: Course,
    as: "course",
    attributes: ["id", "title"],
  },
];

export const getTutorAttributes = () => [
  "id",
  "first_name",
  "last_name",
  "email",
  "bio",
  "expertise",
  "totalStudents",
  "totalLessons",
  "isVerified",
  "avatar",
  "createdAt",
  "updatedAt",
];

export const getUserAttributes = () => ({ exclude: ["password"] });

export const getDateRange = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

export const createEntity = async (
  model: any,
  data: any,
  successMessage: string
) => {
  const entity = await model.create(data);
  return {
    success: true,
    message: successMessage,
    data: entity,
  };
};

export const updateEntity = async (
  model: any,
  id: string,
  updateData: any,
  successMessage: string,
  includeOptions?: any,
  attributes?: any
) => {
  const entity = await model.findByPk(id);
  if (!entity) {
    return { success: false, status: 404, message: "Entity not found" };
  }

  await entity.update(updateData);
  const updatedEntity = await findEntityById(
    model,
    id,
    includeOptions,
    attributes
  );

  return {
    success: true,
    message: successMessage,
    data: updatedEntity,
  };
};

export const deleteEntity = async (
  model: any,
  id: string,
  successMessage: string
) => {
  const entity = await model.findByPk(id);
  if (!entity) {
    return { success: false, status: 404, message: "Entity not found" };
  }

  await entity.destroy();
  return { success: true, message: successMessage };
};

export const listEntities = async (
  model: any,
  whereClause: any,
  page: number,
  limit: number,
  includeOptions?: any,
  attributes?: any,
  orderBy: string = "createdAt",
  orderDirection: string = "DESC"
) => {
  const offset = (Number(page) - 1) * Number(limit);

  const { count, rows } = await model.findAndCountAll({
    where: whereClause,
    include: includeOptions,
    attributes,
    order: [[orderBy, orderDirection]],
    limit: Number(limit),
    offset,
  });

  return { count, rows };
};

export const validateRequiredFields = (data: any, requiredFields: string[]) => {
  const missingFields = requiredFields.filter((field) => !data[field]);
  if (missingFields.length > 0) {
    return {
      isValid: false,
      message: `${missingFields.join(", ")} are required`,
    };
  }
  return { isValid: true, message: "" };
};

export const checkEntityExists = async (
  model: any,
  whereClause: any,
  errorMessage: string
) => {
  const existing = await model.findOne({ where: whereClause });
  if (existing) {
    return { exists: true, message: errorMessage };
  }
  return { exists: false, message: "" };
};

export const sendSuccessResponse = (
  res: Response,
  data: any,
  message?: string,
  status: number = 200
) => {
  const response: any = { success: true };
  if (message) response.message = message;
  if (data) response.data = data;

  return res.status(status).json(response);
};

export const sendErrorResponse = (
  res: Response,
  message: string,
  status: number = 400
) => {
  return res.status(status).json({ message });
};

export const getPaginationParams = (query: any) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const offset = (page - 1) * limit;

  return { page, limit, offset };
};
