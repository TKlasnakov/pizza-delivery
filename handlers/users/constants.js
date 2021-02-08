const USERS = {
    CREATE_USER_FIELDS: [
        {
            name: 'firstName',
            required: true,
            minLength: 2,
            editable: true,
            requiredOnEdit: false
        },
        {
            name: 'lastName',
            minLength: 2,
            required: true,
            editable: true,
            requiredOnEdit: false
        },
        {
            name: 'streetAddress',
            minLength: 10,
            required: true,
            editable: true,
            requiredOnEdit: false
        },
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
    ERRORS: {
        NO_SUCH_USER: 'Email is required'
    }
}

module.exports = USERS;
