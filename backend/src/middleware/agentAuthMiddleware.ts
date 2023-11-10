import { RequestHandler } from "express";
import { allowedAgentRoles } from "../config/allowedRoles";
import { AccountStatus } from "../types/user";

//Role-based access control (RBAC)

const agentAuth: RequestHandler = (req, res, next) => {
  const { roles, accountStatus } = req.user!;

  //user should have all allowed agent roles
  if (!allowedAgentRoles.every((role) => roles.includes(role))) {
    return res.status(403).json({ message: "Forbidden" });
  }

  next(); 
};

export default agentAuth;
