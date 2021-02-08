const FileSystem = require('../file-system/file-system');
const { STATUS_CODES } = require('../common/common');
const { USERS_FOLDER, ORDERS_FOLDER} = require('../common/common')
class Order {
    static removeOrder = (email, orderId, callback) => {
        FileSystem.readFile(USERS_FOLDER, email, (err, userData) => {
            if(err) {
                return callback(STATUS_CODES.INTERNAL_SERVER_ERROR, { err });
            }

            userData.orders = userData.orders.filter(order => order !== orderId);

            FileSystem.editFile(USERS_FOLDER, email, userData, (err) => {
                if (err) {
                    return callback(STATUS_CODES.INTERNAL_SERVER_ERROR, { err });
                }

                FileSystem.deleteFile(ORDERS_FOLDER, orderId, (err) => {
                    if(err) {
                        return callback(STATUS_CODES.INTERNAL_SERVER_ERROR, { err });
                    }

                    return callback(STATUS_CODES.SUCCESS);
                })
            })
        })
    }
}

module.exports = Order;
