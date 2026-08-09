// 404 handler for unmatched routes
const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found - ${req.originalUrl}`));
};

// Central error handler - never leaks stack traces in production
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || "Internal Server Error";

  // Prisma known errors
  if (err.code === "P2002") {
    statusCode = 409;
    message = "A record with this value already exists";
  }
  if (err.code === "P2025") {
    statusCode = 404;
    message = "Record not found";
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };
