import type { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/requireAuth";
import { Group, GroupMember, User } from "../models";
import { handleError } from "../helpers/errorHelper";

import sequelize from "../config/db";

export const listGroups = async (req: AuthenticatedRequest, res: Response) => {
  try {
    console.log("Fetching groups - starting listGroups function");
    const userId = req.user?.id;

    await sequelize.authenticate();
    console.log("Database connection successful");

    const groups = await Group.findAll({
      where: { isPrivate: false },
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "firstName", "lastName", "avatar"],
          required: false,
        },
      ],
      order: [["createdAt", "DESC"]],
      logging: console.log,
    });

    console.log(`Found ${groups.length} groups`);

    const groupsWithCounts = await Promise.all(
      groups.map(async (group) => {
        const groupData = group.toJSON();
        const memberCount = await GroupMember.count({
          where: { groupId: groupData.id },
        });

        let isMember = false;
        if (userId) {
          const membership = await GroupMember.findOne({
            where: { groupId: groupData.id, userId },
          });
          isMember = !!membership;
        }

        return {
          id: groupData.id,
          name: groupData.name,
          description: groupData.description,
          category: groupData.category,
          level: groupData.level,
          maxMembers: groupData.maxMembers,
          isPrivate: groupData.isPrivate,
          memberCount,
          createdBy: (groupData as any).creator,
          createdAt: groupData.createdAt,
          updatedAt: groupData.updatedAt,
          isMember,
        };
      })
    );

    console.log("Successfully formatted groups data");
    return res.json(groupsWithCounts);
  } catch (error) {
    return handleError(res, error, "Error in listGroups");
  }
};

export const getGroup = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    console.log(`Fetching group ${id} for user ${userId}`);

    const group = await Group.findByPk(id, {
      include: [
        {
          model: User,
          as: "members",
          attributes: ["id", "firstName", "lastName", "avatar"],
          through: { attributes: ["role", "joinedAt"] },
          required: false,
        },
        {
          model: User,
          as: "creator",
          attributes: ["id", "firstName", "lastName", "avatar"],
          required: false,
        },
      ],
      logging: console.log,
    });

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    let isMember = false;
    let userRole: string | null = null;
    if (userId) {
      const membership = await GroupMember.findOne({
        where: { groupId: id, userId },
      });
      if (membership) {
        isMember = true;
        userRole = (membership as any).role;
      }
    }

    const formattedGroup = {
      ...group.toJSON(),
      isMember,
      userRole,
    };

    return res.json(formattedGroup);
  } catch (error) {
    return handleError(res, error, "Error getting group");
  }
};

export const createGroup = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, description, category, level, maxMembers, isPrivate } =
      req.body;
    const userId = req.user?.id;

    console.log("Creating group with data:", { name, category, level, userId });

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!name || !category || !level) {
      return res.status(400).json({
        message: "Name, category, and level are required",
      });
    }

    const result = await sequelize.transaction(async (t) => {
      const group = await Group.create(
        {
          name,
          description,
          category,
          level,
          maxMembers,
          isPrivate: isPrivate || false,
          createdBy: userId,
        },
        { transaction: t }
      );

      await GroupMember.create(
        {
          groupId: (group as any).id,
          userId,
          role: "admin",
        },
        { transaction: t }
      );

      return group;
    });

    const createdGroup = await Group.findByPk((result as any).id, {
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "firstName", "lastName", "avatar"],
        },
      ],
    });

    const memberCount = await GroupMember.count({
      where: { groupId: (result as any).id },
    });

    const formattedGroup = {
      ...createdGroup?.toJSON(),
      memberCount,
      isMember: true,
      userRole: "admin",
    };

    console.log("Successfully created group:", (createdGroup as any)?.id);
    return res.status(201).json(formattedGroup);
  } catch (error) {
    return handleError(res, error, "Error creating group");
  }
};

export const deleteGroup = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const group = await Group.findByPk(id);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if ((group as any).createdBy !== userId) {
      return res
        .status(403)
        .json({ message: "Only the creator can delete this group" });
    }

    await sequelize.transaction(async (t) => {
      await GroupMember.destroy({ where: { groupId: id }, transaction: t });
      await group.destroy({ transaction: t });
    });

    return res.json({ message: "Group deleted successfully" });
  } catch (error) {
    return handleError(res, error, "Error deleting group");
  }
};

export const joinGroup = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const group = await Group.findByPk(id);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const existingMembership = await GroupMember.findOne({
      where: { groupId: id, userId },
    });

    if (existingMembership) {
      return res
        .status(400)
        .json({ message: "Already a member of this group" });
    }

    const groupData = group.toJSON();
    if (groupData.maxMembers) {
      const memberCount = await GroupMember.count({ where: { groupId: id } });
      if (memberCount >= groupData.maxMembers) {
        return res.status(400).json({ message: "Group is full" });
      }
    }

    await GroupMember.create({
      groupId: id,
      userId,
      role: "member",
    });

    return res.json({ message: "Successfully joined the group" });
  } catch (error) {
    return handleError(res, error, "Error joining group");
  }
};

export const leaveGroup = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const group = await Group.findByPk(id);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const membership = await GroupMember.findOne({
      where: { groupId: id, userId },
    });

    if (!membership) {
      return res.status(400).json({ message: "Not a member of this group" });
    }

    await membership.destroy();

    return res.json({ message: "Successfully left the group" });
  } catch (error) {
    return handleError(res, error, "Error leaving group");
  }
};

export const getMyGroups = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const memberships = await GroupMember.findAll({
      where: { userId },
      include: [
        {
          model: Group,
          as: "group",
          include: [
            {
              model: User,
              as: "creator",
              attributes: ["id", "firstName", "lastName", "avatar"],
              required: false,
            },
            {
              model: GroupMember,
              as: "groupMembers",
              attributes: ["id"],
            },
          ],
        },
      ],
      order: [["joinedAt", "DESC"]],
    });

    const myGroups = memberships.map((membership) => {
      const membershipData = membership.toJSON();
      const groupData = (membershipData as any).group;

      return {
        ...groupData,
        userRole: membershipData.role,
        joinedAt: membershipData.joinedAt,
        createdBy: groupData.creator || null,
        memberCount: groupData.groupMembers?.length || 0,
      };
    });

    return res.json(myGroups);
  } catch (error) {
    return handleError(res, error, "Error getting user groups");
  }
};
