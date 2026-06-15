import createHttpError from 'http-errors';

export function errorHandler(err, req, res, next) {
  const status =
    err instanceof createHttpError.HttpError ? err.status : err.status || 500;

  res.status(status).json({
    message: err.message,
  });
}
