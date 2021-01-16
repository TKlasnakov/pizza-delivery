const Authentication = require('../../libs/utilities/authentication/authentication');
const FileSystem = require('../../libs/utilities/file-system/file-system');
const COMMON = require('../../libs/utilities/common/common');
const MENU_ITEM = require('./constants')

const menuItems = ({ urlQuery, headers, method }, callback) => {
    const methods = {
        get: getMenuItems
    };

    function getMenuItems() {
        if(!urlQuery.get(MENU_ITEM.REQUIRED_FIELD)) {
            return callback(COMMON.STATUS_CODES.BAD_REQUEST, COMMON.ERRORS.INVALID_FIELDS_PROVIDED(''))
        }
        const email = urlQuery.get(MENU_ITEM.REQUIRED_FIELD);
        const token = headers.token;
        Authentication.userAuthentication(email, token, (isAuthenticated) => {
            if(!isAuthenticated) {
                return callback(COMMON.STATUS_CODES.FORBIDDEN, COMMON.ERRORS.EXPIRED_TOKEN())
            }
            FileSystem.readFile(MENU_ITEM.DIR_NAME, MENU_ITEM.FILE_NAME, (err, menuData) => {
                if(err) {
                    return callback(COMMON.STATUS_CODES.BAD_REQUEST, { error : err });
                }
                return callback(COMMON.STATUS_CODES.SUCCESS, menuData);
            })
        })
    }

    return COMMON.INIT(method, methods, callback);
}

module.exports = menuItems;
