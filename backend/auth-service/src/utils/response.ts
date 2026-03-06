import { Response } from 'express';

export const success = (res: Response, data: object, status = 200) => {
  return res.status(status).json({ success: true, data });
};

export const error = (res: Response, code: string, message: string, status = 400) => {
  return res.status(status).json({ success: false, error: code, message });
};