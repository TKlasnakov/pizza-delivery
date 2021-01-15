const COMMON = {
    ENCODING: 'utf-8',
    REQ_EVENT: {
        RECEIVED_DATA: 'data',
        REQUEST_END: 'end'
    },
    HEADERS: {
        TYPES: {
            CONTENT: 'Content-Type'
        },
        VALUES: {
            APP_JSON: 'application/json'
        }
    },
    STATUS_CODES: {
        SUCCESS: 200,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        METHOD_NOT_ALLOWED: 405,
        INTERNAL_SERVER_ERROR: 500,

    },
    ERRORS: {
        INVALID_REQUIRED_FIELDS: (fields) => ({ error: `Required fields are missing: ${fields}` }),
        INVALID_MIN_LENGTH: (fields) => ({ error: `Fields min length error: ${fields}` }),
        INVALID_PATTERN: (fields) => ({ error: `Invalid field pattern: ${fields}`}),
        NO_EDITABLE_FIELD: () => ({error: 'No editable fields provided'}),
        INVALID_FIELDS_PROVIDED: (fields) => ({error: `Invalid fields provided: ${fields}`})
    }
}

module.exports = COMMON;
