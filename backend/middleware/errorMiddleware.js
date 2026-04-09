// Not found middleware
export const notFound = (req, res, next) => {
  res.status(404);
  throw new Error("Route not found");
};

// Error handler
export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode);

  res.json({
    message: err.message,
  });
};