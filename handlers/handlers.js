const login = require('./login/login');
const logout = require('./logout/logout');
const users = require('./users/users');
const menuItems = require('./menu-items/menu-items');
const cart = require('./cart/cart');
const order = require('./order/order');
const notFound = require('./not-found/not-found')

class Handlers {
    login = login
    logout = logout
    users = users
    menuItems = menuItems
    cart = cart
    order = order
    notFound = notFound
}

module.exports = new Handlers();
