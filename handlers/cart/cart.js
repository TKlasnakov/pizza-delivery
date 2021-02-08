const {
    STATUS_CODES,
    ERRORS,
    MENU_ITEMS_FOLDER,
    ORDERS_FOLDER,
    USERS_FOLDER,
    EMAIL,
    ORDER_ID,
    INIT
} = require('../../libs/utilities/common/common');
const Authentication = require('../../libs/utilities/authentication/authentication');
const FileSystem = require('../../libs/utilities/file-system/file-system');
const Validations = require('../../libs/utilities/validations/validations');
const StringUtilities = require('../../libs/utilities/strings/strings')
const Order = require('../../libs/utilities/order/order')
const CART = require('./constants');

const cart = ({ payload, headers, urlQuery, method }, callback) => {
    const methods = {
        post: handleOrder,
        delete: removeOrder
    }

    function handleOrder() {
        const error = Validations.validateCartFields(CART.CART_FIELDS, payload);
        if(error) {
            return callback(STATUS_CODES.BAD_REQUEST, error);
        }
        const token = headers.token;
        Authentication.userAuthentication(payload.email, token, (isAuthenticated) => {
            if (!isAuthenticated) {
                return callback(STATUS_CODES.FORBIDDEN, ERRORS.EXPIRED_TOKEN())
            }

            FileSystem.readFile(MENU_ITEMS_FOLDER, MENU_ITEMS_FOLDER, (err, items) => {
                if(err) {
                    return callback(STATUS_CODES.INTERNAL_SERVER_ERROR, err);
                }

                const orderData = getOrderData(payload, items);
                const cartIdLength = 20;
                const orderId = StringUtilities.generateRandomString(cartIdLength);

                FileSystem.createFile(ORDERS_FOLDER, orderId, orderData, (err) => {
                    if(err) {
                        return callback(STATUS_CODES.INTERNAL_SERVER_ERROR, {err})
                    }

                    FileSystem.readFile(USERS_FOLDER, payload.email, (err, userData) => {
                        if(err) {
                            return callback(STATUS_CODES.BAD_REQUEST, {error: err});
                        }
                        userData.orders = userData.orders || [];
                        userData.orders.push(orderId);
                        FileSystem.editFile(USERS_FOLDER, payload.email, userData, (err) => {
                            if(err) {
                                return callback(STATUS_CODES.BAD_REQUEST, { error : err })
                            }

                            return callback(STATUS_CODES.SUCCESS, { orderId });
                        })
                    })
                })
            })
        })
    }

    function removeOrder() {
        const email = urlQuery.get(EMAIL);
        const orderId = urlQuery.get(ORDER_ID);
        const token = headers.token;

        if(!orderId || !email) {
            return callback(STATUS_CODES.BAD_REQUEST);
        }
        Authentication.userAuthentication(email, token, (isAuthenticated) => {
            if (!isAuthenticated) {
                return callback(STATUS_CODES.FORBIDDEN, ERRORS.EXPIRED_TOKEN())
            }
            return Order.removeOrder(email, orderId, callback);
        })
    }

    function getOrderData(payload, items) {
        const order = payload.order
            .map(item => {
                return items.menuItems.find(menuItem => item.toLocaleLowerCase() === menuItem.name.toLocaleLowerCase())
            })
            .filter(item => item);

        return {
            email: payload.email,
            order
        }
    }

    return INIT(method, methods, callback);
}

module.exports = cart;
