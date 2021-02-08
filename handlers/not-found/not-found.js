const { STATUS_CODES, ERRORS } = require('../../libs/utilities/common/common')
const notFound = (data, callback) => {
    return callback(STATUS_CODES.NOT_FOUND, ERRORS.NOT_FOUND());
}

module.exports = notFound;
