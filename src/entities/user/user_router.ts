import { Request, Response, Router } from "express";
import { BaseRouter } from "../base/base_router";
import { user_repository, UserRepository } from "./user_repository";
import {
  check_scope,
  mw_is_authentificated,
} from "../../middleware/auth_middleware";

export type Period = {
  start: Date;
  end: Date;
};

export type Time =
  | `${number}-${number}` // e.g. "2023-1"
  | `${number}-${number}-${number}`; // e.g. "2023-1-1"

const REGEX_TIME = /^(?:\d{4}-\d{1,2}(?:-\d{1,2})?)?$/; // YYYY-WW or YYYY-WW-DD

class UserRouter extends BaseRouter<UserRepository> {
  constructor(userRepository: any) {
    super(userRepository);
  }

  isValidTime(time: string): time is Time {
    return REGEX_TIME.test(time) && time.split("-").length <= 3;
  }

  extractPeriod(time: string): Period | null {
    if (!this.isValidTime(time)) {
      return null;
    }
    const [year, week, day] = time.split("-").map(Number);
    const start = new Date(year, 0, 1 + (week - 1) * 7 + (day || 0));
    const end = new Date(year, 0, 1 + (week - 1) * 7 + (day || 0) + 1);
    return { start, end };
  }

  async getSchedule(req: Request, res: Response) {
    const user = req.user;
    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    let schedule = null;
    const pediod = this.extractPeriod(req.query.period as string);
    if (!pediod || pediod.start > pediod.end) {
      res.status(400).json({ message: "Invalid period" });
      return;
    }

    if (user.role === "professor") {
      schedule = await this.repository.getProfessorSchedule(user.id, pediod);
    } else if (user.role === "student") {
      schedule = await this.repository.getStudentSchedule(user.id, pediod);
    } else if (user.role === "admin") {
      const id = req.query.id as string;
      if (id) {
        schedule = await this.repository.getAdminSchedule(user.id, id, pediod);
      }
    } else {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    if (!schedule) {
      res.status(404).json({ message: "Schedule not found" });
      return;
    }

    res.status(200).json(schedule);
  }

  getRouter(): Router {
    const router = Router();

    // Base CRUD operations
    router.get("/", check_scope("read_all:user"), this.getAll.bind(this));
    router.get("/:id", check_scope("read_one:user"), this.getById.bind(this));
    router.post("/", check_scope("create:user"), this.create.bind(this));
    router.put("/:id", check_scope("update:user"), this.update.bind(this));
    router.delete("/:id", check_scope("delete:user"), this.delete.bind(this));

    // Custom routes
    router.get("/schedule", mw_is_authentificated, this.getSchedule.bind(this));

    return router;
  }
}

export const user_router = new UserRouter(user_repository).getRouter();
