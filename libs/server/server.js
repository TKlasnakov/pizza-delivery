const http = require('http');
const router = require('../../router/router');
const { StringDecoder } = require('string_decoder');
const config = require('../../config');
const COMMON = require('../utilities/common/common');
const validations = require('../utilities/validations/validations')

class Server {
    url = `${config.protocol}://${config.hostname}:${config.port}`;

    _httpServer = () => {
        return http.createServer(this._handleServer);
    }

    _handleServer = (req, res) => {
        const url = new URL(req.url, this.url);
        const reqData = {
            route: url.pathname.replace(/^\/+|\/+$/g, ''),
            method: req.method.toLocaleLowerCase(),
            urlQuery: url.searchParams,
            headers: req.headers
        };

        return this._handlePayload(req, res, new StringDecoder(COMMON.ENCODING), reqData);
    }

     _handlePayload = (req, res, decoder, reqData) => {
        let payload = '';

        req.on(COMMON.REQ_EVENT.RECEIVED_DATA, (data) => {
            payload += decoder.write(data);
        })

        req.on(COMMON.REQ_EVENT.REQUEST_END, () => {
            payload += decoder.end();
            reqData = {
                ...reqData,
                payload: validations.payloadValidation(payload, reqData.method)
            }

            this._callHandler(reqData, res)
        })
    }

    _callHandler = (reqData, res) =>  {
        if (reqData.payload.error) {
            res.setHeader(COMMON.HEADERS.TYPES.CONTENT, COMMON.HEADERS.VALUES.APP_JSON);
            res.writeHead(COMMON.STATUS_CODES.BAD_REQUEST);
            res.end(JSON.stringify(reqData.payload));
        } else {
            const handler = router[reqData.route] || router.notFound;

            return handler(reqData, (statusCode, payload) => {
                statusCode = statusCode || COMMON.STATUS_CODES.SUCCESS;
                res.setHeader(COMMON.HEADERS.TYPES.CONTENT, COMMON.HEADERS.VALUES.APP_JSON);
                res.writeHead(statusCode);
                res.end(JSON.stringify(payload));
            });
        }
    }

    init = () => {
        this._httpServer().listen(
            config.port,
            () => console.log(`Server listen on port ${config.port}`)
        );
    }
}

module.exports = new Server();
