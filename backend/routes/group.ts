import { Router } from "express";
import * as groups from "../controllers/groupController";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

router.get("/", requireAuth, groups.listGroups);

router.get("/user/my", requireAuth, groups.getMyGroups);

router.post("/", requireAuth, groups.createGroup);

router.get("/:id", requireAuth, groups.getGroup);
router.delete("/:id", requireAuth, groups.deleteGroup);
router.post("/:id/join", requireAuth, groups.joinGroup);
router.post("/:id/leave", requireAuth, groups.leaveGroup);

export default router;
