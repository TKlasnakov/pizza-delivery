const Server = require('./libs/server/server');
const server = Server;

class Main {
    init() {
        server.init();
    }
}

new Main().init();

