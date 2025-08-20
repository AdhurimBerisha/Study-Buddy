import type { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/requireAuth";
import { User, Tutor, Course, Lesson, Purchase } from "../models";
import { handleError } from "../helpers/errorHelper";
import {
  checkAdminAuth,
  getDateRange,
  sendSuccessResponse,
} from "../helpers/adminHelper";
import { Op } from "sequelize";

const getDashboardStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!checkAdminAuth(req, res)) return;

    const [
      totalUsers,
      regularUsers,
      adminUsers,
      totalTutors,
      totalCourses,
      totalLessons,
      totalPurchases,
    ] = await Promise.all([
      User.count(),
      User.count({ where: { role: "user" } }),
      User.count({ where: { role: "admin" } }),
      Tutor.count(),
      Course.count(),
      Lesson.count(),
      Purchase.count(),
    ]);

    const sevenDaysAgo = getDateRange(7);
    const [recentUsers, recentCourses] = await Promise.all([
      User.count({ where: { createdAt: { [Op.gte]: sevenDaysAgo } } }),
      Course.count({ where: { createdAt: { [Op.gte]: sevenDaysAgo } } }),
    ]);

    sendSuccessResponse(res, {
      users: {
        total: totalUsers,
        regular: regularUsers,
        admin: adminUsers,
        recent: recentUsers,
      },
      tutors: { total: totalTutors },
      courses: { total: totalCourses, recent: recentCourses },
      lessons: { total: totalLessons },
      purchases: { total: totalPurchases },
    });
  } catch (error) {
    handleError(res, error, "Error fetching dashboard statistics");
  }
};

export { getDashboardStats };
