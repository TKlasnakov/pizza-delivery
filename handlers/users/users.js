const STATUS_CODES = require('../../libs/utilities/common/common').STATUS_CODES;
const USERS = require('./constants');
const Validations = require('../../libs/utilities/validations/validations');
const Authentication = require('../../libs/utilities/authentication/authentication');
const FileSystem = require('../../libs/utilities/file-system/file-system');

const Users = ({ payload, method, urlQuery }, callback) => {
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
    }

    function deleteUser() {
        return callback(STATUS_CODES.SUCCESS, 'DELETE');
    }

    function getUserData() {
        if(!urlQuery.get(USERS.FILE_NAME)) {
            return callback(STATUS_CODES.BAD_REQUEST, { error: USERS.ERRORS.NO_SUCH_USER })
        }
        const email = urlQuery.get(USERS.FILE_NAME);
        FileSystem.readFile(USERS.USER_DIRECTORY, email, (err, userData) => {
            if(err) {
                return callback(STATUS_CODES.BAD_REQUEST, { error : err });
            }
            return callback(STATUS_CODES.SUCCESS, userData);
        })
    }

    function init() {
        if(!Object.keys(methods).includes(method)) {
            return callback(STATUS_CODES.METHOD_NOT_ALLOWED, { error: USERS.ERRORS.METHOD_NOT_ALLOWED })
        }

        return methods[method]();
    }

    return init();

}

module.exports = Users;
