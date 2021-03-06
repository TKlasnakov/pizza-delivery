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
    METHODS: {
      POST: 'post',
      GET: 'get',
      DELETE: 'delete',
      PUT: 'put'
    },
    ERRORS: {
        INVALID_REQUIRED_FIELDS: (fields) => ({ error: `Required fields are missing: ${fields}` }),
        INVALID_MIN_LENGTH: (fields) => ({ error: `Fields min length error: ${fields}` }),
        INVALID_PATTERN: (fields) => ({ error: `Invalid field pattern: ${fields}` }),
        NO_EDITABLE_FIELD: () => ({ error: 'No editable fields provided' }),
        INVALID_FIELDS_PROVIDED: (fields) => ({ error: `Invalid fields provided: ${fields}` }),
        METHOD_NOT_ALLOWED: () => ({ error: `Method not allowed` }),
        FAILED_AUTHENTICATION: () => ({ error: 'Wrong email or password' }),
        EXPIRED_TOKEN: () => ({ error: 'Token is expired or invalid' }),
        NOT_ARRAY: (fields) => ({ error : `The field type should be array ${fields}` }),
        NOT_FOUND: () => ({ error: 'No such URL' })
    },
    INIT: (method, methods, callback) => {
        if(!Object.keys(methods).includes(method)) {
            return callback(COMMON.STATUS_CODES.METHOD_NOT_ALLOWED, COMMON.ERRORS.METHOD_NOT_ALLOWED() )
        }

        return methods[method]();
    },
    USERS_FOLDER: 'users',
    ORDERS_FOLDER: 'order',
    TOKENS_FOLDER: 'tokens',
    MENU_ITEMS_FOLDER: 'menu-items',
    EMAIL: 'email',
    ORDER_ID: 'orderId'
}

module.exports = COMMON;
