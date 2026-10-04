export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
};

export const errorHandler = (error, req, res, next) => {
  console.error(error);

  if (error.name === 'ValidationError') {
    return res.status(422).json({
      success: false,
      message: 'Database validation failed',
      errors: Object.values(error.errors).map((item) => item.message)
    });
  }

  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'A record with the same unique value already exists'
    });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid resource identifier'
    });
  }

  if (error instanceof SyntaxError && error.status === 400) {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON payload'
    });
  }

  return res.status(error.statusCode || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : error.message || 'Internal server error'
  });
};