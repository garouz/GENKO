import { Request, Response, NextFunction } from 'express'

class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message)
    Error.captureStackTrace(this, this.constructor)
  }
}

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'

  console.error(
    `[ERROR] ${statusCode} - ${message}`,
    err.stack
  )

  res.status(statusCode).json({
    success: false,
    error: message,
    statusCode,
  })
}

export { AppError }
