const environments = {
    develop: {
        protocol: 'http',
        hostname: 'localhost',
        name: 'develop',
        port: 3000,
        hashingAlgorithm: 'sha256',
        encoding: 'hex',
        hashingSecret: 'somehashingsecretisthis'
    },
    production: {
        protocol: 'http',
        hostname: 'someprodurl',
        name: 'production',
        port: 5000,
        hashingAlgorithm: 'sha256',
        encoding: 'hex',
        hashingSecret: 'somehashingsecretisthis'
    }
};

module.exports = process.env.NODE_ENV ?
    environments[process.env.NODE_ENV.toLowerCase()] || environments.develop
    : environments.develop;
