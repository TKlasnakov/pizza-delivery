const { stripeApiKey } = require('../../config')

const STRIPE_DATA = {
    protocol: 'https:',
    hostname: 'api.stripe.com',
    path: '/v1/charges',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${stripeApiKey}`
    },
    method: 'POST'
}

module.exports = STRIPE_DATA;
