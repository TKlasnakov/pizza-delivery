const {
    STATUS_CODES,
    ERRORS,
    USERS_FOLDER,
    ORDERS_FOLDER,
    TOKENS_FOLDER,
    EMAIL,
    INIT
} = require('../../libs/utilities/common/common');
const USERS = require('../users/constants');
const Authentication = require('../../libs/utilities/authentication/authentication');
const FileSystem = require('../../libs/utilities/file-system/file-system');

const logout = ({ method, urlQuery, headers }, callback) => {
    const methods = {
        get: removeSession
    }

    function removeSession() {
        const email = urlQuery.get(EMAIL);

        if(!email) {
            return callback(STATUS_CODES.BAD_REQUEST, { error: USERS.ERRORS.NO_SUCH_USER });
        }
        const token = headers.token;

        Authentication.userAuthentication(email, token, (isAuthenticated) => {
            if(!isAuthenticated) {
                return callback(STATUS_CODES.FORBIDDEN, ERRORS.EXPIRED_TOKEN());
            }
            FileSystem.deleteFile(TOKENS_FOLDER, token, (err) => {
                if(err) {
                    return callback(STATUS_CODES.INTERNAL_SERVER_ERROR, {error: err});
                }
                removeAllUserOrders(email);

                return callback(STATUS_CODES.SUCCESS);
            })
        })
    }

    function removeAllUserOrders(email) {
        FileSystem.readFile(USERS_FOLDER, email, (err, userData) => {
            if(err) {
                return callback(STATUS_CODES.INTERNAL_SERVER_ERROR, {error: err});
            }
            const orders = userData.orders || [];

            orders.forEach(order => {
                FileSystem.deleteFile(ORDERS_FOLDER, order, (err) => {
                    if(err) {
                        return callback(STATUS_CODES.INTERNAL_SERVER_ERROR, {error: err});
                    }
                })
            })

            userData.orders = [];

            FileSystem.editFile(USERS_FOLDER, email, userData, (err) => {
                if (err) {
                    return callback(STATUS_CODES.INTERNAL_SERVER_ERROR, {err});
                }
            })
        })
    }

    return INIT(method, methods, callback);
}

module.exports = logout;
