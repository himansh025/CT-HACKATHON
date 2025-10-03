const { validationResult } = require('express-validator');

const validateInput = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Forward validation errors to error handler
    const error = new Error('Validation Failed');
    error.status = 400;
    error.details = errors.array();
    return next(error);
  }
  next();
};

module.exports = validateInput;
