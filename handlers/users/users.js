const STATUS_CODES = require('../../libs/utilities/common/common').STATUS_CODES;
const USERS = require('./constants');
const COMMON = require('../../libs/utilities/common/common');
const Validations = require('../../libs/utilities/validations/validations');
const Authentication = require('../../libs/utilities/authentication/authentication');
const FileSystem = require('../../libs/utilities/file-system/file-system');

const Users = ({ payload, method, urlQuery, headers }, callback) => {
    const methods = {
        get: getUserData,
        post: createUser,
        put: editUser,
        delete: deleteUser,
    }

    function createUser() {
        const error = Validations.validateCreateFields(USERS.CREATE_USER_FIELDS, payload);
        if(error) {
            return callback(STATUS_CODES.BAD_REQUEST, error);
        }
        payload.password = Authentication.hashPassword(payload.password);
        FileSystem.createFile(USERS.USER_DIRECTORY, payload.email, payload, (err) => {
            if(err) {
                return callback(STATUS_CODES.BAD_REQUEST, { error : err })
            }
            return callback(STATUS_CODES.SUCCESS);
        });
    }

    function editUser() {
        const error = Validations.validateEditFields(USERS.CREATE_USER_FIELDS, payload);
        if(error) {
            return callback(STATUS_CODES.BAD_REQUEST, error);
        }

        if(payload.password) {
            payload.password = Authentication.hashPassword(payload.password);
        }
        const token = headers.token;
        Authentication.userAuthentication(payload.email, token, (isAuthenticated) => {
            if (!isAuthenticated) {
                return callback(STATUS_CODES.FORBIDDEN, COMMON.ERRORS.EXPIRED_TOKEN())
            }
            FileSystem.readFile(USERS.USER_DIRECTORY, payload.email, (err, data) => {
                if(err) {
                    return callback(STATUS_CODES.BAD_REQUEST, {error: err});
                }
                const userData = {
                    ...data,
                    ...payload
                }
                FileSystem.editFile(USERS.USER_DIRECTORY, payload.email, userData, (err) => {
                    if(err) {
                        return callback(STATUS_CODES.BAD_REQUEST, { error : err })
                    }
                    return callback(STATUS_CODES.SUCCESS);
                })
            })
        })
    }

    function deleteUser() {
        if(!urlQuery.get(USERS.FILE_NAME)) {
            return callback(STATUS_CODES.BAD_REQUEST, { error: USERS.ERRORS.NO_SUCH_USER })
        }
        const email = urlQuery.get(USERS.FILE_NAME);
        const token = headers.token;
        Authentication.userAuthentication(email, token, (isAuthenticated) => {
            if(!isAuthenticated) {
                return callback(STATUS_CODES.FORBIDDEN, COMMON.ERRORS.EXPIRED_TOKEN())
            }
            FileSystem.deleteFile(USERS.USER_DIRECTORY, email, (err) => {
                if(err) {
                    return callback(STATUS_CODES.INTERNAL_SERVER_ERROR, {error: err});
                }
                FileSystem.deleteFile(USERS.TOKEN_DIRECTORY, token, (err) => {
                    if(err) {
                        return callback(STATUS_CODES.INTERNAL_SERVER_ERROR, {error: err});
                    }
                    return callback(STATUS_CODES.SUCCESS);
                })
            })
        })
    }

    function getUserData() {
        if(!urlQuery.get(USERS.FILE_NAME)) {
            return callback(STATUS_CODES.BAD_REQUEST, { error: USERS.ERRORS.NO_SUCH_USER })
        }
        const email = urlQuery.get(USERS.FILE_NAME);
        const token = headers.token;
        Authentication.userAuthentication(email, token, (isAuthenticated) => {
            if(!isAuthenticated) {
                return callback(STATUS_CODES.FORBIDDEN, COMMON.ERRORS.EXPIRED_TOKEN())
            }
            FileSystem.readFile(USERS.USER_DIRECTORY, email, (err, userData) => {
                if(err) {
                    return callback(STATUS_CODES.BAD_REQUEST, { error : err });
                }
                return callback(STATUS_CODES.SUCCESS, userData);
            })
        })
    }

   return COMMON.INIT(method, methods, callback);
}

module.exports = Users;
