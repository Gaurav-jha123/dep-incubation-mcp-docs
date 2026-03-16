import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import pool from '../config/db';

const ACCESS_SECRET  = process.env.JWT_ACCESS_SECRET  || 'dev_access_secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret';

export const signAccessToken = (id: string, email: string, name: string) => {
  return jwt.sign(
    { id, emailId: email, name },
    ACCESS_SECRET,
    { expiresIn: '15m' }
  );
};

export const signRefreshToken = (id: string, email: string, name: string) => {
  return jwt.sign({ id, email, name }, REFRESH_SECRET, { expiresIn: '7d' });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_SECRET);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_SECRET);
};

const hashToken = (token: string) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export const saveRefreshToken = async (userId: string, rawToken: string) => {
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await pool.query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
    [userId, tokenHash, expiresAt]
  );
};

export const findRefreshToken = async (rawToken: string) => {
  const tokenHash = hashToken(rawToken);
  const { rows } = await pool.query(
    `SELECT * FROM refresh_tokens WHERE token_hash = $1 AND expires_at > NOW()`,
    [tokenHash]
  );
  return rows[0] || null;
};

export const deleteRefreshToken = async (rawToken: string) => {
  const tokenHash = hashToken(rawToken);
  await pool.query(`DELETE FROM refresh_tokens WHERE token_hash = $1`, [tokenHash]);
};