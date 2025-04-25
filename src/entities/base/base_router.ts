import express from "express";
import { IBaseRepository } from "./base_repository";

export class BaseRouter<R extends IBaseRepository<any>> {
  constructor(protected repository: R) {}

  async getAll(req: any, res: any) {

    try {
      const data = await this.repository.findAll({}, {
        limit: parseInt(req.query.limit) || 10,
        page: parseInt(req.query.page) || 1,
        sort: req.query.sort || "-createdAt",
      });
      res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ message: error });
    }
  }

  async getById(req: any, res: any) {
    try {
      const data = await this.repository.findById(req.params.id);
      if (!data) {
        return res.status(404).json({ message: "Not found" });
      }
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  async create(req: any, res: any) {
    try {
      const data = await this.repository.create(req.body);
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  getFullRouter(): express.Router {
    const router = express.Router();
    router.get("/", this.getAll.bind(this));
    router.get("/:id", this.getById.bind(this));
    router.post("/", this.create.bind(this));
    router.put("/:id", this.update.bind(this));
    router.delete("/:id", this.delete.bind(this));

    return router;
  }

  getRouter(): express.Router {
    return this.getFullRouter();
  }

  async update(req: any, res: any) {
    try {
      const data = await this.repository.update(
        req.params.id,
        req.body
      );
      if (!data) {
        return res.status(404).json({ message: "Not found" });
      }
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
  
  async delete(req: any, res: any) {
    try {
      const data = await this.repository.delete(req.params.id);
      if (!data) {
        return res.status(404).json({ message: "Not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
}
