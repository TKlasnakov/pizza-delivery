const { mailgunApiKey } = require('../../config')

const MAILGUN_DATA = {
    protocol: 'https:',
    hostname: 'api.mailgun.net',
    path: '/v3/sandbox4ec0ced5c81f48878a4462d5be8774a0.mailgun.org/messages',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${new Buffer(mailgunApiKey).toString('base64')}`
    },
    method: 'POST'
}

module.exports = MAILGUN_DATA;
