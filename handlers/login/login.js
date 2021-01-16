const COMMON = require('../../libs/utilities/common/common');
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
            return callback(COMMON.STATUS_CODES.BAD_REQUEST, error);
        }

        FileSystem.readFile(TOKEN.USER_DIRECTORY, payload.email, (err, userData) => {
            if(err) {
                return callback(COMMON.STATUS_CODES.INTERNAL_SERVER_ERROR, err);
            }

            if(Authentication.hashPassword(payload.password) !== userData.password) {
               return callback(COMMON.STATUS_CODES.BAD_REQUEST, COMMON.ERRORS.FAILED_AUTHENTICATION());
            }

            const tokenData = Authentication.createTokenData(payload.email);
            FileSystem.createFile(
                TOKEN.TOKEN_DIRECTORY,
                tokenData.id,
                tokenData,
                (err) => {
                    if(err) {
                        return callback(COMMON.STATUS_CODES.INTERNAL_SERVER_ERROR);
                    }

                    return callback(COMMON.STATUS_CODES.SUCCESS, tokenData);
                }
            )

        })

    }

    function extendToken() {
        if(!payload.tokenId || !(payload.shouldExtend === true)) {
            return callback(COMMON.STATUS_CODES.BAD_REQUEST, COMMON.ERRORS.INVALID_FIELDS_PROVIDED(''))
        }

        FileSystem.readFile(TOKEN.TOKEN_DIRECTORY, payload.tokenId, (err, tokenData) => {
            if(err) {
                return callback(COMMON.STATUS_CODES.BAD_REQUEST);
            }

            if(tokenData.expires < Date.now()) {
                return callback(COMMON.STATUS_CODES.BAD_REQUEST, COMMON.ERRORS.EXPIRED_TOKEN());
            }

            tokenData.expires = Authentication.extendToken();

            FileSystem.editFile(TOKEN.TOKEN_DIRECTORY, tokenData.id, tokenData, (err) => {
                if(err) {
                    console.log(err);
                    return callback(COMMON.STATUS_CODES.INTERNAL_SERVER_ERROR, { error: err });
                }

                return callback(COMMON.STATUS_CODES.SUCCESS);
            })
        })
    }

    return COMMON.INIT(method, methods, callback);
}

module.exports = login;
