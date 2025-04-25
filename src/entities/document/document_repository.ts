import { model } from "mongoose";
import { BaseMongoRepository } from "../base/base_repository";
import { document_schema, IDocumentEntity } from "./document";


export class DocumentRepository extends BaseMongoRepository<IDocumentEntity> {

}

const document_model = model("Document", document_schema);
export const document_repository = new DocumentRepository(document_model);