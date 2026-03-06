const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error(err);
  const status = err.statusCode || 500;
  const message = err.message || "Internal server error";

  res.status(status).json({
    success: false,
    message,
    errors: err.errors || undefined,
  });
};

module.exports = { notFoundHandler, errorHandler };

