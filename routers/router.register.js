'use strict';

const catalogueRouter = require('./catalogue/catalogue.router');
// const cartRouter = require('./cart/cart.router');
// const checkoutRouter = require('./checkout/checkout.router');

const register = (app) => {
  app.use('/', catalogueRouter);
  // app.use('/cart', cartRouter);
  // app.use('/checkout', checkoutRouter);
};

module.exports = register;
