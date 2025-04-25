import { Schema } from "mongoose";
import { base_entity_schema, IBaseEntity } from "../base/base_entity";


export interface IProfessorEntity extends IBaseEntity {
    userId: string;
    bio: string;
}

export const professor_schema = new Schema<IProfessorEntity>({
    "userId": {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    "bio": {
        type: String,
        required: true,
    },
    ...base_entity_schema
});