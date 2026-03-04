import { StatusCodes } from 'http-status-codes';

// Ce middleware va valider que l'id passé en paramètre est un nombre entier
export function validateId(req, res, next) {
  const id = parseInt(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid ID' });
  }
  next();
}

// Ce middleware va valider que les données de req.body respectent le schema passé en paramètre
export function errorHandler(err, _req, res, next) {
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: true,
      message: err.message,
      details: err.stack
  });
  next();
}