const {
    protocol,
    hostname,
    path,
    method,
    headers
} = require('./constants');
const https = require('https');
const querystring = require('querystring');

class Mailgun {
    sendEmail = (params, callback) => {
        const queryString = querystring.stringify(params);
        const requestDetails = {
            protocol,
            hostname,
            method,
            path: `${path}?${queryString}`,
            headers
        };
        const req = https.request(requestDetails, ({ statusCode, statusMessage }) => {

            if(statusCode === 200 || statusCode === 201) {
                return callback(null);
            }
            return callback(statusMessage)
        });

        req.on('error', (err) => callback(err));
        req.end();
    }
}

module.exports = new Mailgun();
