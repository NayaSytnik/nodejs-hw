import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';
import { createSession, setSessionCookies } from '../services/auth.js';

export async function registerUser(req, res) {
  const { email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    throw createHttpError(400, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashedPassword,
  });

  const session = await createSession(user._id);
  setSessionCookies(res, session);

  res.status(201).json(user);
}

export async function loginUser(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw createHttpError(401, 'Invalid credentials');
  }

  await Session.deleteMany({ userId: user._id });

  const session = await createSession(user._id);
  setSessionCookies(res, session);

  res.status(200).json(user);
}

export async function refreshUserSession(req, res) {
  const { sessionId, refreshToken } = req.cookies;

  const session = await Session.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  if (session.refreshTokenValidUntil < new Date()) {
    await Session.findByIdAndDelete(session._id);

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.clearCookie('sessionId');

    throw createHttpError(401, 'Session token expired');
  }

  await Session.findByIdAndDelete(session._id);

  const newSession = await createSession(session.userId);
  setSessionCookies(res, newSession);

  res.status(200).json({ message: 'Session refreshed' });
}

export async function logoutUser(req, res) {
  const { sessionId } = req.cookies;

  if (sessionId) {
    await Session.findByIdAndDelete(sessionId);
  }

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.clearCookie('sessionId');

  return res.status(204).send();
}