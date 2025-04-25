import { BaseRouter } from "../base/base_router";
import { log_repository, LogRepository } from "./log_repository";


class LogRouter extends BaseRouter<LogRepository> {
    constructor(logRepository: LogRepository) {
        super(logRepository);
    }
    
    async getByUserId(req: any, res: any) {
        const userId = req.params.userId;
        const logs = await this.repository.findByUserId(userId);
        res.json(logs);
    }

    async getByAction(req: any, res: any) {
        const action = req.params.action;
        const logs = await this.repository.findByAction(action);
        res.json(logs);
    }

    async getByTimestampRange(req: any, res: any) {
        const { start, end } = req.query;
        const logs = await this.repository.findByTimestampRange(new Date(start), new Date(end));
        res.json(logs);
    }

    getRouter() {
        const router = super.getRouter();
        router.get("/user/:userId", this.getByUserId.bind(this));
        router.get("/action/:action", this.getByAction.bind(this));
        router.get("/timestamp", this.getByTimestampRange.bind(this));
        return router;
    }
}

export const log_router = new LogRouter(log_repository).getRouter();