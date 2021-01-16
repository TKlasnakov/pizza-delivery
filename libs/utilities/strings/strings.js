class StringUtilities {
    static generateRandomString(length) {
        const possibleChars = 'abcdefghijklmnoprstuvwxyz1234567890';
        let randomString = '';
        for (let i = 0; i < length; i++) {
            randomString += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
        }

        return randomString;
    }
}

module.exports = StringUtilities;

