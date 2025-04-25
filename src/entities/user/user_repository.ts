import { Model, model } from "mongoose";
import { BaseMongoRepository } from "../base/base_repository";
import { IUserEntity, user_schema } from "./user";
import { course_repository } from "../course/course_repository";
import { Period } from "./user_router";
import { ITimetableEntity } from "../course/course";

export class UserRepository extends BaseMongoRepository<IUserEntity> {
  constructor(userModel: Model<IUserEntity>) {
    super(userModel);
  }

  async findByEmail(email: string): Promise<IUserEntity | null> {
    return this.model.findOne({ email });
  }

  async getProfessorSchedule(
    userId: string,
    period: Period
  ): Promise<ITimetableEntity[]> {
    const course = await course_repository.findByProfessorId(userId, period);
    return course.map((c) => c.timetables).flat();
  }

  async getStudentSchedule(
    userId: string,
    period: Period
  ): Promise<ITimetableEntity[]> {
    const course = await course_repository.findByStudentId(userId, period);
    return course.map((c) => c.timetables).flat();
  }

  async getAdminSchedule(
    userId: string,
    id: string,
    period: Period
  ): Promise<ITimetableEntity[]> {
    const user = await this.model.findById(userId).exec();
    if (!user) {
      throw new Error("User not found");
    }
    if (user.role === "professor") {
      return this.getProfessorSchedule(userId, period);
    } else if (user.role === "student") {
      return this.getStudentSchedule(userId, period);
    }

    throw new Error("Admin cannot have a schedule");
  }
}

const user_model = model("User", user_schema);
export const user_repository = new UserRepository(user_model);
