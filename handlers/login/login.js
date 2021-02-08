const {
    STATUS_CODES,
    ERRORS,
    TOKENS_FOLDER,
    USERS_FOLDER,
    INIT
} = require('../../libs/utilities/common/common');
const TOKEN = require('./constants');
const Validations = require('../../libs/utilities/validations/validations');
const FileSystem = require('../../libs/utilities/file-system/file-system');
const Authentication = require('../../libs/utilities/authentication/authentication');

const login = ({ payload, method, urlQuery, headers }, callback) => {
    const methods = {
        post: createToken,
        put: extendToken
    }

    function createToken() {
        const error = Validations.validateCreateFields(TOKEN.CREATE_TOKEN_FIELDS, payload);
        if(error) {
            return callback(STATUS_CODES.BAD_REQUEST, error);
        }

        FileSystem.readFile(USERS_FOLDER, payload.email, (err, userData) => {
            if(err) {
                return callback(STATUS_CODES.INTERNAL_SERVER_ERROR, err);
            }

            if(Authentication.hashPassword(payload.password) !== userData.password) {
               return callback(STATUS_CODES.BAD_REQUEST, ERRORS.FAILED_AUTHENTICATION());
            }

            const tokenData = Authentication.createTokenData(payload.email);
            FileSystem.createFile(
                TOKENS_FOLDER,
                tokenData.id,
                tokenData,
                (err) => {
                    if(err) {
                        return callback(STATUS_CODES.INTERNAL_SERVER_ERROR);
                    }

                    return callback(STATUS_CODES.SUCCESS, tokenData);
                }
            )

        })

    }

    function extendToken() {
        if(!payload.email || !(payload.shouldExtend === true)) {
            return callback(STATUS_CODES.BAD_REQUEST, ERRORS.INVALID_FIELDS_PROVIDED(''))
        }
        const token = headers.token;
        Authentication.userAuthentication(payload.email, token, (isAuthenticated) => {
            if (!isAuthenticated) {
                return callback(STATUS_CODES.FORBIDDEN, ERRORS.EXPIRED_TOKEN())
            }

            FileSystem.readFile(TOKENS_FOLDER,  headers.token, (err, tokenData) => {
                if(err) {
                    return callback(STATUS_CODES.BAD_REQUEST);
                }

                if(tokenData.expires < Date.now()) {
                    return callback(STATUS_CODES.BAD_REQUEST, ERRORS.EXPIRED_TOKEN());
                }

                tokenData.expires = Authentication.extendToken();

                FileSystem.editFile(TOKENS_FOLDER, tokenData.id, tokenData, (err) => {
                    if(err) {
                        console.log(err);
                        return callback(STATUS_CODES.INTERNAL_SERVER_ERROR, { error: err });
                    }

                    return callback(STATUS_CODES.SUCCESS);
                })
            })
        })

    }

    return INIT(method, methods, callback);
}

module.exports = login;
