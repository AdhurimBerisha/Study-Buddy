import { Router } from "express";
import {
  listGroups,
  getGroup,
  createGroup,
  updateGroup,
  deleteGroup,
  joinGroup,
  leaveGroup,
  getMyGroups,
  getGroupMessages,
} from "../controllers/groupController";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

router.get("/", requireAuth, listGroups);

router.get("/user/my", requireAuth, getMyGroups);

router.post("/", requireAuth, createGroup);

router.get("/:id", requireAuth, getGroup);
router.get("/:id/messages", requireAuth, getGroupMessages);
router.put("/:id", requireAuth, updateGroup);
router.delete("/:id", requireAuth, deleteGroup);
router.post("/:id/join", requireAuth, joinGroup);
router.post("/:id/leave", requireAuth, leaveGroup);

export default router;
