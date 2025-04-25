import express, { ErrorRequestHandler, Request, Response } from "express";
import { user_router } from "./entities/user/user_router";
import { log_middleware } from "./middleware/log_middleware";
import auth_router from "./routes/auth_router";
import { log_router } from "./entities/log/log_router";
import { mw_is_authentificated } from "./middleware/auth_middleware";
import { document_router } from "./entities/document/document_router";
import { classe_router } from "./entities/classe/classe_router";
import { trace_middleware } from "./middleware/trace_middleware";

const app = express();

app.use(express.json());

// Middleware
app.use(log_middleware);
app.use(trace_middleware);

// Routers
app.use("/users", mw_is_authentificated, user_router);
app.use("/logs", mw_is_authentificated, log_router);
app.use("/documents", mw_is_authentificated, document_router);
app.use("/classes", mw_is_authentificated, classe_router);
app.use(auth_router);

// Health check route
app.get("/heath", (req: Request, res: Response) => {
  res.status(200).json({ message: "API is running" });
});

export default app;
