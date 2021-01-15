const handlers = require('../handlers/handlers')

const router = {
    users: handlers.users,
    login: handlers.login,
    logout: handlers.logout,
    menuItems: handlers.menuItems,
    cart: handlers.cart,
    order: handlers. order,
    notFound: handlers.notFound
}

module.exports = router;
