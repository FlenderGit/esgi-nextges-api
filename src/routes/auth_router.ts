import jwt from "jsonwebtoken";
import { Request, Response, Router } from "express";
import { ENV } from "../config/env";
import { mw_is_authentificated } from "../middleware/auth_middleware";
import { user_repository } from "../entities/user/user_repository";
import bcrypt from "bcrypt";

const auth_router = Router();

auth_router.get("/me", mw_is_authentificated, async (req, res) => {
  res.json(req.user);
});

auth_router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  const user = await user_repository.findByEmail(email);
  if (!user) {
    res.status(401).json({ message: "Invalid email or password" });
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const isMatch = await bcrypt.compare(password, hashedPassword);
  if (!isMatch) {
    res.status(401).json({ message: "Invalid email or password" });
    return;
  }

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email
    },
    ENV.JWT_SECRET,
    {
      expiresIn: "1h",
    },
  );

  res.status(200).json({
    token,
  });
});

export default auth_router;
