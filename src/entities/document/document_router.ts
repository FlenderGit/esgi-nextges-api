import { Request, Response, Router } from "express";
import { BaseRouter } from "../base/base_router";
import { document_repository, DocumentRepository } from "./document_repository";
import { check_scope } from "../../middleware/auth_middleware";
import multer from "multer";
import { IDocumentEntity } from "./document";

const upload = multer({ dest: 'uploads/' })

interface DocumentUploadRequest {
  file: Express.Multer.File;
  name: string;
  description: string;
  classeId: string|null;
}

class DocumentRouter extends BaseRouter<DocumentRepository> {
  constructor(repository: DocumentRepository) {
    super(repository);
  }

  async uploadDocument(req: Request, res: Response) {
    // extract all fields from the request
    const { name, description, classeId } = req.body as DocumentUploadRequest;
    const file = req.file as Express.Multer.File;
    if (!file || !name || !description) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const document = {
      name,
      description,
      classeId,
      url: file.path,
      uploadBy: req.user.id,
    };

    const result = await this.repository.create(document);
    if (result) {
      res.status(201).json(result);
    } else {
      res.status(500).json({ message: "Error uploading document" });
    }
  }

  getRouter(): Router {
    const router = Router();
    router.get("/", check_scope("read_all:user"), this.getAll.bind(this));
    router.get("/:id", check_scope("read_one:user"), this.getById.bind(this));
    router.post("/", check_scope("create:document"), upload.single("file"), this.uploadDocument.bind(this));
    router.put("/:id", check_scope("update:user"), this.update.bind(this));
    router.delete("/:id", check_scope("delete:user"), this.delete.bind(this));
    return router;
  }
}

export const document_router = new DocumentRouter(document_repository).getRouter();
