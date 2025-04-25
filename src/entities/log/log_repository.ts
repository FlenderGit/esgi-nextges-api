import { model, Model } from "mongoose";
import { BaseMongoRepository } from "../base/base_repository";
import { ILogEntity, log_schema } from "./log";

export class LogRepository extends BaseMongoRepository<ILogEntity> {

    constructor(logModel: Model<ILogEntity>) {
        super(logModel);
    }
    
    async findByUserId(userId: string): Promise<ILogEntity[]> {
        return await this.model.find({ userId }).exec();
    }
    
    async findByAction(action: string): Promise<ILogEntity[]> {
        return await this.model.find({ action }).exec();
    }
    
    async findByTimestampRange(start: Date, end: Date): Promise<ILogEntity[]> {
        return await this.model.find({ timestamp: { $gte: start, $lte: end } }).exec();
    }
}

const log_model = model("Log", log_schema);
export const log_repository = new LogRepository(log_model);
