const fs = require('fs');
const path = require('path');
const FILE_SYSTEM = require('./constants');
const Validations = require('../validations/validations')

class FileSystem {
    static baseDir = path.join(__dirname, FILE_SYSTEM.DATA_PATH);

    static createFile(dir, fileName, data, callback) {
        fs.open(
            `${this.baseDir}${dir}/${fileName}${FILE_SYSTEM.FILE_EXTENSION}`,
            FILE_SYSTEM.FLAGS.WX,
            (err, fileDescriptor) => {

                if(err) {
                    return callback(FILE_SYSTEM.ERRORS.CREATION(err))
                }
                const stringData = JSON.stringify(data);
                fs.writeFile(fileDescriptor, stringData, (error) => {
                    if(error) {
                        return callback(FILE_SYSTEM.ERRORS.WRITING(err));
                    }
                    fs.close(fileDescriptor, (err) => {
                        if(err) {
                            return callback(FILE_SYSTEM.ERRORS.CLOSING(err));
                        }
                        return callback(false);
                    })
                });
        })
    }

    static editFile(dir, fileName, data, callback) {
        fs.open(
            `${this.baseDir}${dir}/${fileName}${FILE_SYSTEM.FILE_EXTENSION}`,
            FILE_SYSTEM.FLAGS.R,
            (err, fileDescriptor) => {
                if(err) {
                    return callback(FILE_SYSTEM.ERRORS.OPEN(err));
                }
                const stringData = JSON.stringify(data);

                fs.ftruncate(fileDescriptor, (err) => {
                    if(err) {
                        return callback(FILE_SYSTEM.ERRORS.UPDATING(err));
                    }
                    fs.writeFile(fileDescriptor, stringData, (err) => {
                        if(err) {
                            return callback(FILE_SYSTEM.ERRORS.WRITING(err));
                        }

                        fs.close(fileDescriptor, (err) => {
                            if(err) {
                                return callback(FILE_SYSTEM.ERRORS.CLOSING);
                            }
                            return callback(null);
                        })
                    })
                })
            }
        )
    }

    static deleteFile(dir, fileName, callback) {
        fs.unlink(
            `${this.baseDir}${dir}/${fileName}${FILE_SYSTEM.FILE_EXTENSION}`,
            (err) => {
                if(err) {
                    return callback(err);
                }

                return callback(null);
        })
    }

    static readFile(dir, fileName, callback) {
        fs.readFile(
            `${this.baseDir}${dir}/${fileName}${FILE_SYSTEM.FILE_EXTENSION}`,
            FILE_SYSTEM.ENCODING,
            (err, data) => {
                const parsedData = Validations.payloadValidation(data);

                if(err) {
                    return callback(FILE_SYSTEM.ERRORS.NO_ENTITY(err), parsedData);
                }

                return callback(null, parsedData);
        });
    }
}

module.exports = FileSystem
