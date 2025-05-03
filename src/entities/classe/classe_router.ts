import { Request, Response } from "express";
import { BaseRouter } from "../base/base_router";
import { classe_repository, ClasseRepository } from "./classe_repository";
import { check_scope } from "../../middleware/auth_middleware";

class ClasseRouter extends BaseRouter<ClasseRepository> {
  constructor(classeRepository: ClasseRepository) {
    super(classeRepository);
  }

  async getExamens(req: Request, res: Response) {
    const { id } = req.params;
    const examen = await this.repository.getExamens(id);
    if (examen) {
      res.status(200).json(examen);
    } else {
      res.status(404).json({ message: "Examen not found" });
    }
  }

  async createExamen(req: Request, res: Response) {
    const { id } = req.params;
    const examenData = req.body;
    const examen = await this.repository.createExamen(id, examenData);
    if (examen) {
      res.status(201).json(examen);
    } else {
      res.status(400).json({ message: "Error creating examen" });
    }
  }

  async updateExamen(req: Request, res: Response) {
    const { id } = req.params;
    const examenData = req.body;
    const examen = await this.repository.updateExamen(id, examenData);
    if (examen) {
      res.status(200).json(examen);
    } else {
      res.status(404).json({ message: "Examen not found" });
    }
  }

  async deleteExamen(req: Request, res: Response) {
    const { id, id_examen } = req.params;
    const result = await this.repository.deleteExamen(id, id_examen);
    if (result) {
      res.status(204).json({ message: "Examen deleted" });
    } else {
      res.status(404).json({ message: "Examen not found" });
    }
  }

  getRouter() {
    const router = super.getRouter();

    // Simple CRUD operations
    router.get("/", check_scope("read_all:course"), this.getAll.bind(this));
    router.get("/:id", check_scope("read_one:course"), this.getById.bind(this));
    router.post("/", check_scope("create:course"), this.create.bind(this));
    router.put("/:id", check_scope("update:course"), this.update.bind(this));
    router.delete("/:id", check_scope("delete:course"), this.delete.bind(this));

    // examen
    router.get(
      "/:id/examen",
      check_scope("read_one:examen"),
      this.getExamens.bind(this),
    );
    router.post(
      "/:id/examen",
      check_scope("create:examen"),
      this.createExamen.bind(this),
    );
    router.put(
      "/:id/examen",
      check_scope("update:examen"),
      this.updateExamen.bind(this),
    );
    router.delete(
      "/:id/examen/:id_examen",
      check_scope("delete:examen"),
      this.deleteExamen.bind(this),
    );

    return router;
  }
}

export const classe_router = new ClasseRouter(classe_repository).getRouter();
