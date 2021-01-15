const notFound = (data, callback) => {
    return callback(404, {error: 'No such URL.'});
}

module.exports = notFound;
