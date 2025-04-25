import { Request } from 'express';
import { Claims } from '../auth';

declare module 'express-serve-static-core' {
  interface Request {
    user: Claims
    timestamp: Date
    "trace-id": string
  }
}