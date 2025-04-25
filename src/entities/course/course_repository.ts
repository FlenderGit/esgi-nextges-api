import { model } from "mongoose";
import { BaseMongoRepository } from "../base/base_repository";
import { course_schema, ICourseEntity } from "./course";
import { classe_repository } from "../classe/classe_repository";
import { Period } from "../user/user_router";

class CourseRepository extends BaseMongoRepository<ICourseEntity> {
  async findByProfessorId(
    professorId: string,
    period: Period
  ): Promise<ICourseEntity[]> {
    return await this.model
      .find({
        professorId,
        $and: [
          { startDate: { $lte: period.end } },
          { endDate: { $gte: period.start } },
        ],
      })
      .exec();
  }

  async findByStudentId(
    studentId: string,
    period: Period
  ): Promise<ICourseEntity[]> {
    const classes = await classe_repository.findAll({ studentId });
    const classeIds = classes.map((c) => c._id);
    return await this.model
      .find({
        _id: { $in: classeIds },
        $and: [
          { startDate: { $lte: period.end } },
          { endDate: { $gte: period.start } },
        ],
      })
      .exec();
  }
}

const course_model = model<ICourseEntity>("Course", course_schema);
export const course_repository = new CourseRepository(course_model);
