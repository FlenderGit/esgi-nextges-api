import { NextFunction, Request, RequestHandler, Response } from "express";
import { ENV } from "../config/env";
import jwt from "jsonwebtoken";
import { Claims } from "../@types/auth";
import { Scope } from "../entities/user/user";


export const mw_is_authentificated: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const bearer = req.headers["authorization"];
  const token =
    bearer && bearer.startsWith("Bearer ") ? bearer.split(" ")[1] : null;
  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  try {
    const user = await new Promise<Claims>((resolve, reject) => {
      jwt.verify(token, ENV.JWT_SECRET, (err, decoded) => {
        if (err) return reject(err);
        resolve(decoded as Claims);
      });
    });

    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      scopes: user.scopes,
      role: user.role
    }
    
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};

export const check_scope = (
  scope: Scope
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    
    await mw_is_authentificated(req, res, next);
    const user = req.user as Claims;

    const [action, resource] = scope.split(":");

    if (user.scopes && !user.scopes.some((s) => {
      const [action_inner, resource_inner] = s.split(":");
      return s == scope
      || (action_inner == action && resource_inner == "*")
      || (action_inner == "*" && resource_inner == "*")
      || (action_inner == "*" && resource_inner == resource);
    })) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }
    next();
  };
}
