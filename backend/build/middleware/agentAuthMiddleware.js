"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const allowedRoles_1 = require("../config/allowedRoles");
//Role-based access control (RBAC)
const agentAuth = (req, res, next) => {
    const { roles, accountStatus } = req.user;
    //user should have all allowed agent roles
    if (!allowedRoles_1.allowedAgentRoles.every((role) => roles.includes(role))) {
        return res.status(403).json({ message: "Forbidden" });
    }
    next();
};
exports.default = agentAuth;
