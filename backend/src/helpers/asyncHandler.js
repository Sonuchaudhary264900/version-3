/**
 * Async Handler
 * Wraps async controller functions to avoid try/catch everywhere
 */

const asyncHandler = (fn) => {

  return (req, res, next) => {

    Promise.resolve(fn(req, res, next))
      .catch(next);

  };

};

module.exports = asyncHandler;