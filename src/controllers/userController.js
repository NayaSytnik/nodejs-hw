import createHttpError from 'http-errors';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export async function updateUserAvatar(req, res) {
  if (!req.file) {
    throw createHttpError(400, 'No file');
  }

  const result = await saveFileToCloudinary(req.file.buffer);

  req.user.avatar = result.secure_url;
  await req.user.save();

  res.json({ url: result.secure_url });
}
