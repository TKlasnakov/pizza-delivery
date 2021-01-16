const TOKEN = {
    CREATE_TOKEN_FIELDS : [
        {
            name: 'email',
            pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            required: true,
            editable: false,
            requiredOnEdit: true
        },
        {
            name: 'password',
            minLength: 6,
            required: true,
            editable: true,
            requiredOnEdit: false
        }
    ],
    USER_DIRECTORY: 'users',
    TOKEN_DIRECTORY: 'tokens',
    FILE_NAME: 'email',

}

module.exports = TOKEN;
