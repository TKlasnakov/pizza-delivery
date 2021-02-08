const {
    protocol,
    headers,
    path,
    hostname,
    method
} = require('./constants');
const https = require('https');
const { StringDecoder } = require('string_decoder');
const { ENCODING, REQ_EVENT } = require('../utilities/common/common.js');
const querystring = require('querystring');

class Stripe {
    makePayment = (params, callback) => {
        const queryString = querystring.stringify(params);
        const decoder = new StringDecoder(ENCODING);
        const requestDetails = {
            protocol,
            hostname,
            method,
            path: `${path}?${queryString}`,
            headers
        };

        const req = https.request(requestDetails, (res) => {
            const status = res.statusCode;
            let payload = ''
            res.on(REQ_EVENT.RECEIVED_DATA, data => {
                payload += decoder.write(data);
            })
            res.on(REQ_EVENT.REQUEST_END, () => {
                if(status === 200 || status === 201) {
                    callback(payload);
                } else {
                    callback(`Status returned was ${status}`);
                }
            })
        });

        req.on('error', (err) => callback(err));
        req.end();
    }
}

module.exports = new Stripe();
