import { Router } from "express";
import * as groups from "../controllers/groupController";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

router.get("/", groups.listGroups);
router.get("/:id", groups.getGroup);
router.post("/:id/join", requireAuth, groups.joinGroup);
router.post("/:id/leave", requireAuth, groups.leaveGroup);

export default router;
