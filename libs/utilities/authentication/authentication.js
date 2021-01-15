const config = require('../../../config');
const crypto = require('crypto');

class Authentication {
    static authenticate() {}

    static hashPassword(password) {
        return crypto
            .createHmac(config.hashingAlgorithm, config.hashingSecret)
            .update(password)
            .digest(config.encoding);
    }
}

module.exports = Authentication;
