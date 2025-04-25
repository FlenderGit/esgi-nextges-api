import { Schema } from "mongoose";

export interface IBaseEntity {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export const base_entity_schema = {
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
};