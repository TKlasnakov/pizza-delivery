const CART = {
    CART_FIELDS: [
        {
            name: 'order',
            required: true,
            arrayType: true
        },
        {
            name: 'email',
            pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            required: true,
        }
    ]
}

module.exports = CART;
