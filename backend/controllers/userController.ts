import { Request, Response } from "express";
import { Op } from "sequelize";
import { User } from "../models/User";
import { findUserById, removePassword } from "../helpers/userHelper";
import { handleError } from "../helpers/errorHelper";

interface RequestWithUser extends Request {
  user?: { id: number };
  file?: Express.Multer.File;
}

const myProfile = async (req: RequestWithUser, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const user = await findUserById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.json({ success: true, data: user });
  } catch (error) {
    handleError(res, error, "Error fetching profile");
  }
};

const updateProfile = async (req: RequestWithUser, res: Response) => {
  try {
    const userId = req.user?.id;
    const { firstName, lastName, email, phone } = req.body;

    if (email) {
      const existingUser = await User.findOne({
        where: { email, id: { [Op.ne]: userId } },
      });
      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, message: "Email already in use" });
      }
    }

    const user = await User.findByPk(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const updateData: any = { firstName, lastName, email, phone };

    if (req.file) {
      updateData.avatar = req.file.path;
    }

    const filteredData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined)
    );

    await user.update(filteredData);

    res.json({ success: true, data: removePassword(user) });
  } catch (error) {
    handleError(res, error, "Error updating profile");
  }
};

export { myProfile, updateProfile };
