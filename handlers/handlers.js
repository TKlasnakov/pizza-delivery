const users = require('./users/users');
const menuItems = require('./menu-items/menu-items');
const cart = require('./cart/cart');
const order = require('./order/order');
const notFound = require('./not-found/not-found');
const usersAuthentication = require('./users-authentication/users-authentication');

class Handlers {
    usersAuthentication
    users
    menuItems
    cart
    order
    notFound
}

module.exports = new Handlers();
