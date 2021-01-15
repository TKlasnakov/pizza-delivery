const FILE_SYSTEM = {
    DATA_PATH: '/../../../.data/',
    FLAGS: {
        WX: 'wx',
        R: 'r+'
    },
    ENCODING: 'utf-8',
    FILE_EXTENSION: '.json',
    ERRORS: {
        OPEN: (error) => `Could not open file: ${error}`,
        CREATION: (error) => `Could not create file: ${error}`,
        WRITING: (error) => `Could not write on file: ${error}`,
        CLOSING: (error) => `Could not close the file: ${error}`,
        NO_ENTITY: (error) => `No such entity: ${error}`,
        UPDATING: (error) => `File could not be updated: ${error}`,
    }
}

module.exports = FILE_SYSTEM;
