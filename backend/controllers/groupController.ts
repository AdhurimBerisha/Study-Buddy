import type { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/requireAuth";
import { Group, GroupMember, User, Message } from "../models";
import { handleError } from "../helpers/errorHelper";
import { socketManager } from "../config/socket";

import sequelize from "../config/db";

const listGroups = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    await sequelize.authenticate();

    const groups = await Group.findAll({
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "firstName", "lastName", "avatar"],
          required: false,
        },
      ],
      order: [["createdAt", "DESC"]],
    });

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
          memberCount,
          createdBy: (groupData as any).creator,
          createdAt: groupData.createdAt,
          updatedAt: groupData.updatedAt,
          isMember,
        };
      })
    );

    return res.json(groupsWithCounts);
  } catch (error) {
    return handleError(res, error, "Error in listGroups");
  }
};

const getGroup = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

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

const createGroup = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, description, category, level, maxMembers } = req.body;
    const userId = req.user?.id;

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

    return res.status(201).json(formattedGroup);
  } catch (error) {
    return handleError(res, error, "Error creating group");
  }
};

const updateGroup = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const { name, description, category, level, maxMembers } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const group = await Group.findByPk(id);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const userMembership = await GroupMember.findOne({
      where: { groupId: id, userId },
    });

    if (
      (group as any).createdBy !== userId &&
      (userMembership as any)?.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Only the creator or admin can update this group" });
    }

    await group.update({
      name,
      description,
      category,
      level,
      maxMembers,
    });

    const updatedGroup = await Group.findByPk(id, {
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "firstName", "lastName", "avatar"],
        },
      ],
    });

    const memberCount = await GroupMember.count({
      where: { groupId: id },
    });

    const membership = await GroupMember.findOne({
      where: { groupId: id, userId },
    });

    const formattedGroup = {
      ...updatedGroup?.toJSON(),
      memberCount,
      isMember: !!membership,
      userRole: (membership as any)?.role || "admin",
    };

    return res.json(formattedGroup);
  } catch (error) {
    return handleError(res, error, "Error updating group");
  }
};

const deleteGroup = async (req: AuthenticatedRequest, res: Response) => {
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

const joinGroup = async (req: AuthenticatedRequest, res: Response) => {
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

    const user = await User.findByPk(userId);
    if (user) {
      const userData = user.toJSON();
      socketManager.emitToGroup(id, "member_joined", {
        type: "member_joined",
        groupId: id,
        data: {
          user: {
            id: userData.id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            avatar: userData.avatar,
          },
          memberCount: await GroupMember.count({ where: { groupId: id } }),
        },
      });
    }

    return res.json({ message: "Successfully joined the group" });
  } catch (error) {
    return handleError(res, error, "Error joining group");
  }
};

const leaveGroup = async (req: AuthenticatedRequest, res: Response) => {
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

    const user = await User.findByPk(userId);
    if (user) {
      const userData = user.toJSON();
      socketManager.emitToGroup(id, "member_left", {
        type: "member_left",
        groupId: id,
        data: {
          user: {
            id: userData.id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            avatar: userData.avatar,
          },
          memberCount: await GroupMember.count({ where: { groupId: id } }),
        },
      });
    }

    return res.json({ message: "Successfully left the group" });
  } catch (error) {
    return handleError(res, error, "Error leaving group");
  }
};

const getMyGroups = async (req: AuthenticatedRequest, res: Response) => {
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

const getGroupMessages = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const membership = await GroupMember.findOne({
      where: { groupId: id, userId },
    });

    if (!membership) {
      return res
        .status(403)
        .json({ message: "You must be a member to view messages" });
    }

    const messages = await Message.findAll({
      where: { groupId: id },
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["id", "firstName", "lastName", "avatar"],
        },
      ],
      order: [["createdAt", "ASC"]],
      limit: 100,
    });

    const formattedMessages = messages.map((message) => {
      const messageData = message.toJSON();
      const sender = (messageData as any).sender;
      return {
        id: messageData.id,
        groupId: messageData.groupId,
        content: messageData.content,
        senderId: messageData.userId,
        sender: sender
          ? `${sender.firstName} ${sender.lastName}`
          : "Unknown User",
        timestamp: messageData.createdAt,
      };
    });

    return res.json(formattedMessages);
  } catch (error) {
    console.error("❌ Error in getGroupMessages:", error);
    return handleError(res, error, "Error in getGroupMessages");
  }
};

export {
  listGroups,
  getGroup,
  createGroup,
  updateGroup,
  deleteGroup,
  joinGroup,
  leaveGroup,
  getMyGroups,
  getGroupMessages,
};
