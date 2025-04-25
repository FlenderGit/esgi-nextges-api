import { Schema } from "mongoose";
import { base_entity_schema, IBaseEntity } from "../base/base_entity";


export interface IDocumentEntity extends IBaseEntity {
    classeId: string | null;
    name: string;
    description: string;
    url: string;
    uploadBy: string;
}

const document_schema = new Schema<IDocumentEntity>({
    "uploadBy": {
        type: String,
        required: true,
    },
    "classeId": {
        type: String,
        required: false,
    },
    "name": {
        type: String,
        required: true,
    },
    "description": {
        type: String,
        required: true,
    },
    "url": {
        type: String,
        required: true,
    },
    ...base_entity_schema
});

document_schema.index({ courseId: 1, uploadId: 1 });

export { document_schema };
