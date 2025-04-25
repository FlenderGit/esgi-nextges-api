import { Schema } from "mongoose";
import { base_entity_schema, IBaseEntity } from "../base/base_entity";

export interface ITimetableEntity {
    "date": Date;
    "start_time": string;
    "end_time": string;
    "subject": string;
    "teacher": string;
    "location": string;
}

export interface ICourseEntity extends IBaseEntity {
    code: string;
    name: string;
    description: string;
    professorId: string;
    timetables: Array<ITimetableEntity>;
}

export const COURSE_CODE_REGEX = /^[A-Z]{3}-\d{3}$/;

export const course_schema = new Schema<ICourseEntity>({
    "code": {
        type: String,
        required: true,
        unique: true,
        match: COURSE_CODE_REGEX,
        index: true,
    },
    "name": {
        type: String,
        required: true,
    },
    "description": {
        type: String,
        required: true,
    },
    "professorId": {
        type: String,
        required: true,
        index: true,
    },
    "timetables": {
        type: [Object],
        required: true,
    },
    ...base_entity_schema
});