import { Schema } from "mongoose";
import { base_entity_schema, IBaseEntity } from "../base/base_entity";

export interface IUserEntity extends IBaseEntity {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  role: Role;
  scopes: Array<Scope>;
  classeId: string | null;
}

const ROLES = ["admin", "student", "professor", "*"] as const;
export type Role = (typeof ROLES)[number];

const ACTIONS = [
  "read_one",
  "read_all",
  "write",
  "delete",
  "create",
  "update",
  "*",
] as const;
type Action = (typeof ACTIONS)[number];

const RESSOURCES = ["user", "event", "document", "course", "examen"] as const;
type Resource = (typeof RESSOURCES)[number];

export type Scope = `${Action}:${Resource}`;
const SCOPES = ACTIONS.flatMap((action) =>
  RESSOURCES.map((resource) => `${action}:${resource}` as Scope),
);

export const user_schema = new Schema<IUserEntity>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ROLES,
    default: "student",
    required: true,
    index: true,
  },
  scopes: {
    type: [String],
    enum: SCOPES,
    default: [],
    required: true,
  },
  classeId: {
    type: String,
    required: false,
    default: null,
    index: true,
  },
  ...base_entity_schema,
});
