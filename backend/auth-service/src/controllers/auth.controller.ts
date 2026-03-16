import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/auth.service';
import { verifyRefreshToken, findRefreshToken, deleteRefreshToken, signAccessToken, signRefreshToken, saveRefreshToken } from '../services/token.service';
import { success, error } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
/**
 login -> refresh token created 
 day 7 -> /auth/refresh -> new Token issued have to integrate in frontend
 day 8 -> refresh token expired -> user msut login again
 */


const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const register = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
    return error(res, 'VALIDATION_ERROR', 'Name, email and password are required', 422);
  }

  if (password.length < 8) {
    return error(res, 'VALIDATION_ERROR', 'Password must be at least 8 characters', 422);
  }
  try {
    const user = await registerUser(name, email, password);
    return success(res, { user }, 201);
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'EMAIL_TAKEN') {
      return error(res, 'EMAIL_TAKEN', 'Email already in use', 409);
    }
    return error(res, 'SERVER_ERROR', 'Something went wrong', 500);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken, user } = await loginUser(email, password);
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
    return success(res, { accessToken, user });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === 'INVALID_CREDENTIALS') {
      return error(res, 'INVALID_CREDENTIALS', 'Email or password is incorrect', 401);
    }
    return error(res, 'SERVER_ERROR', 'Something went wrong', 500);
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return error(res, 'NO_REFRESH_TOKEN', 'No refresh token', 401);

    const decoded = verifyRefreshToken(token) as { id: string; email: string; name: string };
    const stored  = await findRefreshToken(token);
    if (!stored) return error(res, 'TOKEN_INVALID', 'Token revoked or expired', 401);

    await deleteRefreshToken(token);

    const accessToken     = signAccessToken(decoded.id, decoded.email, decoded.name);
    const newRefreshToken = signRefreshToken(decoded.id, decoded.email, decoded.name);
    await saveRefreshToken(decoded.id, newRefreshToken);

    res.cookie('refreshToken', newRefreshToken, COOKIE_OPTIONS);
    return success(res, { accessToken });
  } catch {
    return error(res, 'TOKEN_INVALID', 'Invalid refresh token', 401);
  }
};

export const logout = async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;
  if (token) await deleteRefreshToken(token).catch(() => {});
  res.clearCookie('refreshToken', COOKIE_OPTIONS);
  return success(res, { message: 'Logged out' });
};

export const me = async (req: AuthenticatedRequest, res: Response) => {
  return success(res, { user: req.user });
};