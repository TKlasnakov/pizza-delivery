const {
    STATUS_CODES,
    ERRORS,
    ORDERS_FOLDER,
    INIT
} = require('../../libs/utilities/common/common');
const Stripe = require('../../libs/stripe/stripe');
const Mailgun = require('../../libs/mailgun/mailgun');
const Authentication = require('../../libs/utilities/authentication/authentication');
const FileSystem = require('../../libs/utilities/file-system/file-system');
const Validations = require('../../libs/utilities/validations/validations');
const { FIELDS, STOTINKI_IN_LEV, CURRENCY, SOURCE, EMAIL_CONTENT, EMAIL_SUBJECT } = require('./constants');
const Order = require('../../libs/utilities/order/order');
const { mailgunEmail, pirpleTestEmail } = require('../../config');

const orders = ({ headers, method, payload }, callback) => {
    const methods = {
        post: payOrder
    };

    function payOrder() {
        const error = Validations.validateCreateFields(FIELDS, payload);
        if(error) {
            return callback(STATUS_CODES.BAD_REQUEST, error);
        }
        const token = headers.token;
        Authentication.userAuthentication(payload.email, token, (isAuthenticated) => {
            if(!isAuthenticated) {
                return callback(STATUS_CODES.FORBIDDEN, ERRORS.EXPIRED_TOKEN())
            }
            FileSystem.readFile(ORDERS_FOLDER, payload.orderId, (err, { order }) => {
                if(err) {
                    return callback(STATUS_CODES.BAD_REQUEST, { error : err });
                }

                const amount = calculatePrice(order);

                Stripe.makePayment({ amount, currency: CURRENCY, source: SOURCE}, (data) => {
                    const parsedData = JSON.parse(data);
                    const emailParams = {
                        from: mailgunEmail,
                        to: payload.email,
                        subject: EMAIL_SUBJECT,
                        text: EMAIL_CONTENT(parsedData.receipt_url)
                    }
                    Mailgun.sendEmail(emailParams, (err) => {
                        if(err) {
                            return callback(err);
                        }

                        return Order.removeOrder(payload.email, payload.orderId, callback);
                    })
                });
            })
        })
    }

    function calculatePrice(order) {
        return Math.round(order.reduce((accumulator, { price }, ) => {
            return accumulator + price
        }, 0) * STOTINKI_IN_LEV);
    }

    return INIT(method, methods, callback);
}

module.exports = orders;


