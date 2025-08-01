function errorHandler(err, req, res, next) {
  console.error(err.stack);

  // Handle specific error types
  if (err.message.includes('not found')) {
    return res.status(404).json({
      success: false,
      error: err.message
    });
  }

  if (err.message.includes('already exists') || 
      err.message.includes('No valid fields')) {
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }

  // Default error response
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
}

module.exports = errorHandler;