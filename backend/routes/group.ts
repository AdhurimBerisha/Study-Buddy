import { Router } from "express";
import * as groups from "../controllers/groupController";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

// Public routes
router.get("/", requireAuth, groups.listGroups);

// IMPORTANT: Specific routes must come BEFORE parameterized routes
router.get("/user/my", requireAuth, groups.getMyGroups);

// Protected routes
router.post("/", requireAuth, groups.createGroup);

// Parameterized routes (must come last)
router.get("/:id", groups.getGroup);
router.delete("/:id", requireAuth, groups.deleteGroup);
router.post("/:id/join", requireAuth, groups.joinGroup);
router.post("/:id/leave", requireAuth, groups.leaveGroup);

export default router;
