import { Router } from "express";
import {
  getTaskModuleChapter,
  updateTaskModuleChapter,
} from "controllers/taskModuleChapter.controller";

const router = Router();

router.post("/getTaskModuleChapter", getTaskModuleChapter);
router.post("/updateTaskModuleChapter", updateTaskModuleChapter);

export default router;
