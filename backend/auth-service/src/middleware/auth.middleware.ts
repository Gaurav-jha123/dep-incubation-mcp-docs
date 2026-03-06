import { Request , Response , NextFunction } from "express";
import { error } from "../utils/response";
import { verifyAccessToken } from "../services/token.service";



export const authenticateToken = (req : Request, res : Response, next : NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if(!token){
        return error(res, 'NO_TOKEN' , 'Access token required', 401);
    }

    try {
        const decoded = verifyAccessToken(token);
        (req as any).user = decoded;
        next();
    } catch (err : any) {
        if (err.name === 'TokenExpiredError') {
      return error(res, 'TOKEN_EXPIRED', 'Token expired', 401);
    }
    return error(res, 'TOKEN_INVALID', 'Invalid token', 403);
  }
};
