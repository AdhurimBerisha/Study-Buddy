import { User } from "../models/User";

export const findUserById = async (id: number) => {
  return await User.findByPk(id, { attributes: { exclude: ["password"] } });
};

export const removePassword = (user: any) => {
  const { password, ...userWithoutPassword } = user.toJSON();
  return userWithoutPassword;
};
