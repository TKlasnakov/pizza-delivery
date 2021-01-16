const config = require('../../../config');
const crypto = require('crypto');
const StringUtilities = require('../strings/strings')

class Authentication {
    static isAuthenticated() {}

    static hashPassword(password) {
        return crypto
            .createHmac(config.hashingAlgorithm, config.hashingSecret)
            .update(password)
            .digest(config.encoding);
    }

    static createTokenData(email) {
        const idLength = 20;
        const millisecondsToHour = 1000 * 60 * 60;

        return {
            email,
            id: StringUtilities.generateRandomString(idLength),
            expires: Date.now() + millisecondsToHour
        }
    }

    static extendToken() {
        const millisecondsToHour = 1000 * 60 * 60;

        return Date.now() + millisecondsToHour;
    }
}

module.exports = Authentication;
