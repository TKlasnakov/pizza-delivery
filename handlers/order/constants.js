const ORDER = {
    FIELDS: [
        {
            name: 'email',
            pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            required: true
        },
        {
            name: 'orderId',
            minLength: 20,
            required: true
        }
    ],
    STOTINKI_IN_LEV: 100,
    CURRENCY: 'bgn',
    SOURCE: 'tok_mastercard',
    EMAIL_SUBJECT: 'Pizza delivery invoice',
    EMAIL_CONTENT: (url) => `You can check your invoice at ${url}`
}

module.exports = ORDER;
