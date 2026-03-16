import bcrypt from 'bcryptjs';
import pool from '../config/db';
import { signAccessToken, signRefreshToken, saveRefreshToken } from './token.service';

export const registerUser = async (name: string, email: string, password: string) => {
  // Check if email already exists
  const existing = await pool.query(
    `SELECT id FROM users WHERE email = $1`,
    [email.toLowerCase()]
  );
  if (existing.rows[0]) {
    throw new Error('EMAIL_TAKEN');
  }

  // Hash password before saving
  const hash = await bcrypt.hash(password, 10);

  const { rows } = await pool.query(
    `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, role`,
    [name, email.toLowerCase(), hash]
  );

  return rows[0];
};

export const loginUser = async (email: string, password: string) => {
  const { rows } = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email.toLowerCase()]
  );

  const user = rows[0];

  // Same error whether email wrong or password wrong — prevents email duplication basically same email
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('INVALID_CREDENTIALS');
  }

  const accessToken  = signAccessToken(user.id, user.email, user.name);
  const refreshToken = signRefreshToken(user.id, user.email, user.name);

  await saveRefreshToken(user.id, refreshToken);

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  };
};