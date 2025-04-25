import { Schema } from "mongoose";

export interface ILogEntity {
    _id: string;
    userId: string;
    action: string;
    message: string;
    timestamp: Date;
}

const log_schema = new Schema<ILogEntity>({
    "userId": {
        type: String,
        required: true,
    },
    "action": {
        type: String,
        required: true,
    },
    "message": {
        type: String,
        required: true,
    },
    "timestamp": {
        type: Date,
        required: true,
        default: Date.now,
    },
});

log_schema.index({ timestamp: -1 });
log_schema.index({ userId: 1 });

export { log_schema };