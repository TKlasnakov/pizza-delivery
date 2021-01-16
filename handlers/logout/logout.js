const COMMON = require('../../libs/utilities/common/common');

const logout = ({ method, urlQuery }, callback) => {
    const methods = {
        get: removeSession
    }

    function removeSession() {

    }

    return COMMON.INIT(method, methods, callback);
}

module.exports = logout;
