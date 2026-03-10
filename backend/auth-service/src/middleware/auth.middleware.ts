import { Request , Response , NextFunction } from "express";
import { error } from "../utils/response";
import { verifyAccessToken } from "../services/token.service";
import { JwtPayload } from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export const authenticateToken = (req : AuthenticatedRequest, res : Response, next : NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if(!token){
        return error(res, 'NO_TOKEN' , 'Access token required', 401);
    }

    try {
        const decoded = verifyAccessToken(token);
        req.user = decoded as JwtPayload;
        next();
    } catch (err : unknown) {
        if (err instanceof Error && err.name === 'TokenExpiredError') {
      return error(res, 'TOKEN_EXPIRED', 'Token expired', 401);
    }
    return error(res, 'TOKEN_INVALID', 'Invalid token', 403);
  }
};
