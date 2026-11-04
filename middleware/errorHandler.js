module.exports = (err, req, res, next) => {
  if (res.headersSent) return next(err);
  const status = err.status || err.statusCode || (err.name === 'ValidationError' || err.name === 'CastError' ? 400 : 500);
  if (status >= 500) console.error(err);
  const message = status >= 500 ? 'Internal server error.' : err.message || 'Request failed.';
  res.status(status).json({ success: false, message });
};
