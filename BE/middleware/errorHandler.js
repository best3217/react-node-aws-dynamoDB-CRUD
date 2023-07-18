const HTTPStatusCode = require("../utils/errors/httpStatusCode")

const errorHandler = (err, req, res, next) => {

  return res.status(HTTPStatusCode.InternalServerError).json({ errorMessage: err.message, errors: err })
}

module.exports = errorHandler
