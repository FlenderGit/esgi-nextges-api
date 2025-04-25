import { Schema } from "mongoose";
import { base_entity_schema, IBaseEntity } from "../base/base_entity";

interface INoteEntity {
    "date": Date;
    "note": number;
    "userId": string;
    "description"?: string;
}

export interface IExamenEntity extends IBaseEntity {
    name: string;
    description: string;
    notes: Array<INoteEntity>;
}

export interface IClasseEntity extends IBaseEntity {
    name: string;
    year: number;
    studentIds: string[];
    examens: Array<IExamenEntity>;
}

export const classe_schema = new Schema<IClasseEntity>({
    "name": {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    "year": {
        type: Number,
        required: true,
        index: true,
        min: 2000,        
    },
    "studentIds": {
        type: [String],
        required: true,
    },
    ...base_entity_schema
});