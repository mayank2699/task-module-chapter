import { Request, Response } from "express";
import asyncHandeler from "../utils/asyncHandeler";
import { createCustomError } from "../utils/customError";
import { ApiResponse } from "../utils/ApiResponse";
import Task from "models/task";
import Chapter from "models/chapter";
import Module from "models/module";

export const updateTaskModuleChapter = asyncHandeler(
  async (req: Request, res: Response) => {
    const { chapterId } = req.params;
    const { complete } = req.body;

    if (typeof complete !== "boolean") {
      throw createCustomError("Invalid complete value", 400);
    }

    const chapter = await Chapter.findOne({
      where: {
        id: chapterId,
      },
    });

    if (!chapter) {
      throw createCustomError("chapter not found", 404);
    }

    chapter.isComplete = complete;
    await Chapter.update(chapter, {
      where: {
        id: chapterId,
      },
    });
    const moduleId = chapter.module_id;
    const chapters = await Chapter.findAll({ where: { module_id: moduleId } });

    const completedChapters = chapters.filter((ch) => ch.isComplete).length;
    const totalChapters = chapters.length;

    const moduleCompletePercent = Math.round(
      (completedChapters / totalChapters) * 100
    );

    const module = await Module.findOne({
      where: {
        id: moduleId,
      },
    });

    if (!module) {
      throw createCustomError("No module found", 404);
    }

    module.complete_percent = moduleCompletePercent;
    await Module.update(module, {
      where: {
        id: moduleId,
      },
    });

    const taskId = module.task_id;
    const modules = await Module.findAll({ where: { task_id: taskId } });

    const completedModules = modules.reduce(
      (sum, mod) => sum + mod.complete_percent,
      0
    );
    const totalModules = modules.length;

    const taskCompletePercent = Math.round(completedModules / totalModules);

    const task = await Task.findOne({
      where: {
        id: taskId,
      },
    });

    if (!task) {
      throw createCustomError("No task found", 404);
    }

    task.complete_percent = taskCompletePercent;
    await Task.update(task, {
      where: {
        id: taskId,
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, "Data update successfully"));
  }
);

export const getTaskModuleChapter = asyncHandeler(
  async (req: Request, res: Response) => {
    const taskId = req.params.id;

    const task = await Task.findOne({
      where: { id: taskId },
      attributes: ["id", "name", "complete_percent"],
      include: [
        {
          model: Module,
          as: "modules",
          attributes: ["id", "name", "complete_percent"],
          include: [
            {
              model: Chapter,
              as: "chapters",
              attributes: ["id", "name", "complete_percent"],
            },
          ],
        },
      ],
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const response = {
      taskId: task.id,
      taskName: task.name,
      taskCompletePercent: task.complete_percent,
      module: task.modules.map((module) => ({
        moduleId: module.id,
        moduleName: module.name,
        moduleCompletePercent: module.complete_percent,
        chapters: module.chapters.map((chapter) => ({
          chapterId: chapter.id,
          chapterName: chapter.name,
          isComplete: chapter.isComplete,
        })),
      })),
    };
    return res.status(200).json(
      new ApiResponse(200, "Task data found", {
        data: response,
      })
    );
  }
);
