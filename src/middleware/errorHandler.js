import { HttpError } from 'http-errors';

export function errorHandler(err, req, res, next) {
  const isHttpError = err instanceof HttpError;

  const status = isHttpError ? err.status : 500;

  res.status(status).json({
    message: err.message || 'Internal Server Error',
  });
}
