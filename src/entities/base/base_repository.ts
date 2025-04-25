import { FilterQuery, Model } from "mongoose";
import { IBaseEntity } from "./base_entity";

export type Pagination = {
  page?: number;
  limit?: number;
  sort?: string;
}

export interface IBaseRepository<T> {
  create(data: T): Promise<T>;
  findById(id: string): Promise<T | null>;
  findAll(filter: FilterQuery<T>, pagination: Pagination): Promise<T[]>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}

export class BaseMongoRepository<T> implements IBaseRepository<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Omit<T, keyof IBaseEntity>): Promise<T> {
    const entity = new this.model(data);
    try {
      const savedEntity = await entity.save();
      return savedEntity as T;
    } catch (error) {
      console.error("Error saving entity:", error);
      throw new Error("Failed to save entity");
    }
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id).exec();
  }

  async findOne(query: Partial<T>): Promise<T | null> {
    return await this.model.findOne(query).exec();
  }

  async findAll(filter: FilterQuery<T> = {}, options: Pagination = {}): Promise<T[]> {
    const { page = 1, limit = 10, sort = "" } = options;
    const skip = (page - 1) * limit;
    const query = this.model.find(filter).skip(skip).limit(limit);
    if (sort) {
      query.sort(sort);
    }
    return await query.exec();
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return result !== null;
  }
}
