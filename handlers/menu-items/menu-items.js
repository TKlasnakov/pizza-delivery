const {
    STATUS_CODES,
    ERRORS,
    EMAIL,
    MENU_ITEMS_FOLDER,
    INIT
} = require('../../libs/utilities/common/common');
const Authentication = require('../../libs/utilities/authentication/authentication');
const FileSystem = require('../../libs/utilities/file-system/file-system');

const menuItems = ({ urlQuery, headers, method }, callback) => {
    const methods = {
        get: getMenuItems
    };

    function getMenuItems() {
        if(!urlQuery.get(EMAIL)) {
            return callback(STATUS_CODES.BAD_REQUEST, ERRORS.INVALID_FIELDS_PROVIDED(''));
        }
        const email = urlQuery.get(EMAIL);
        const token = headers.token;
        Authentication.userAuthentication(email, token, (isAuthenticated) => {
            if(!isAuthenticated) {
                return callback(STATUS_CODES.FORBIDDEN, ERRORS.EXPIRED_TOKEN());
            }
            FileSystem.readFile(MENU_ITEMS_FOLDER, MENU_ITEMS_FOLDER, (err, menuData) => {
                if(err) {
                    return callback(STATUS_CODES.BAD_REQUEST, { error : err });
                }
                return callback(STATUS_CODES.SUCCESS, menuData);
            })
        })
    }

    return INIT(method, methods, callback);
}

module.exports = menuItems;
