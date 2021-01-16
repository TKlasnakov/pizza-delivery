const config = require('../../../config');
const crypto = require('crypto');
const StringUtilities = require('../strings/strings');
const FileSystem = require('../file-system/file-system');
const TOKEN = require('../../../handlers/login/constants')

class Authentication {
    static userAuthentication(email, token, callback) {
       FileSystem.readFile(TOKEN.TOKEN_DIRECTORY, token, (err, tokenData) => {
           if(err) {
               return callback(false);
           }

           if(tokenData.email !== email || tokenData.expires < Date.now()) {
               return callback(false);
           }

           return callback(true);
       })
    }

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
