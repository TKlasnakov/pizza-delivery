const environments = {
    develop: {
        protocol: 'http',
        hostname: 'localhost',
        name: 'develop',
        port: 3000,
        hashingAlgorithm: 'sha256',
        encoding: 'hex',
        hashingSecret: 'somehashingsecretisthis',
        stripeApiKey: 'sk_test_51IFKdlECseaXneT9EL4hHqxSoQ6FLlKnqpqvkPX4uUOAkgbADnejuPrdHxIQkTLpbQI1oC9Bs07tUmNRAHDtmudY00PnMqIlzg',
        mailgunApiKey: 'api:cf357498bc8f2a8c165245867a783e4a-360a0b2c-0219a454',
        mailgunEmail: 'mailgun@sandbox4ec0ced5c81f48878a4462d5be8774a0.mailgun.org',
        pirpleTestEmail: 'pirple.mailgun.test@gmail.com',
        pirpleTestEmailPassword: 'pIrPlE123'
    },
    production: {
        protocol: 'http',
        hostname: 'someprodurl',
        name: 'production',
        port: 5000,
        hashingAlgorithm: 'sha256',
        encoding: 'hex',
        hashingSecret: 'somehashingsecretisthis',
        stripeApiKey: 'sk_test_51IFKdlECseaXneT9EL4hHqxSoQ6FLlKnqpqvkPX4uUOAkgbADnejuPrdHxIQkTLpbQI1oC9Bs07tUmNRAHDtmudY00PnMqIlzg',
        mailgunApiKey: 'api:cf357498bc8f2a8c165245867a783e4a-360a0b2c-0219a454',
        mailgunEmail: 'mailgun@sandbox4ec0ced5c81f48878a4462d5be8774a0.mailgun.org',
        pirpleTestEmail: 'pirple.mailgun.test@gmail.com',
        pirpleTestEmailPassword: 'pIrPlE123'
    }
};

module.exports = process.env.NODE_ENV ?
    environments[process.env.NODE_ENV.toLowerCase()] || environments.develop
    : environments.develop;
