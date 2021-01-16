const COMMON = require('../../libs/utilities/common/common');
const Authentication = require('../../libs/utilities/authentication/authentication');
const FileSystem = require('../../libs/utilities/file-system/file-system');
const USERS = require('../users/constants');

const logout = ({ method, urlQuery, headers }, callback) => {
    const methods = {
        get: removeSession
    }

    function removeSession() {
        if(!urlQuery.get(USERS.FILE_NAME)) {
            return callback(STATUS_CODES.BAD_REQUEST, { error: USERS.ERRORS.NO_SUCH_USER })
        }
        const email = urlQuery.get(USERS.FILE_NAME);
        const token = headers.token;
        Authentication.userAuthentication(email, token, (isAuthenticated) => {
            if(!isAuthenticated) {
                return callback(COMMON.STATUS_CODES.FORBIDDEN, COMMON.ERRORS.EXPIRED_TOKEN())
            }
            FileSystem.deleteFile(USERS.TOKEN_DIRECTORY, token, (err) => {
                if(err) {
                    return callback(COMMON.STATUS_CODES.INTERNAL_SERVER_ERROR, {error: err});
                }
                return callback(COMMON.STATUS_CODES.SUCCESS);
            })
        })
    }

    return COMMON.INIT(method, methods, callback);
}

module.exports = logout;
