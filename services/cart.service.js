'use strict';

const { v4: uuidv4 } = require('uuid');
const db = require('../models/index');

const product = require('../models/product/product');
const cart = require('../models/cart/cart');
const cartItem = require('../models/cart/cartitem');

const cartModel = cart(db.sequelize, db.Sequelize.DataTypes);
const cartItemModel = cartItem(db.sequelize, db.Sequelize.DataTypes);
const productModel = product(db.sequelize, db.Sequelize.DataTypes);

//Associate The Models
cartModel.associate({ CartItem: cartItemModel });
cartItemModel.associate({ Cart: cartModel, Product: productModel });

/* Gets Unique Cart Id */
const uniqueCartId = (request) => {
  if (request.session.uniqueCartId) {
    return request.session.uniqueCartId;
  } else {
    request.session.uniqueCartId = generateUniqueId();
    return request.session.uniqueCartId;
  }
};

/* Generate Unique Id */
const generateUniqueId = () => {
  var uiid = uuidv4();
  return uiid;
};

/* Get Cart */
const getCart = (request) => {
  var uniqueId = uniqueCartId(request);
  const cart = cartModel.findOrCreate({ where: { uniqueCartId: uniqueId } });
  return cart;
};

/* Add To Cart */
const addToCart = (request) => {
  const productId = request.body.productId;
  getCart(request).then((cart) => {
    cartItemModel
      .findOne({
        where: { productId: productId, cartId: cart[0].id },
      })
      .then((cartItem) => {
        if (cartItem) {
          var qnt = cartItem.quantity + 1;
          cartItemModel.update(
            { quantity: qnt },
            {
              where: { productId: productId, cartId: cart[0].id },
            }
          );
        } else {
          cartItemModel.create({
            quantity: 1,
            cartId: cart[0].id,
            productId: productId,
          });
        }
      });
  });
};

/* Remove From Cart */
const removeFromCart = (request) => {
  var cartItemId = request.body.cartItemId;
  return cartItemModel.destroy({
    where: { id: cartItemId },
  });
};

/* Get Cart Items */
const getCartItems = (request) => {
  return getCart(request).then((cart) => {
    return cartItemModel
      .findAll({
        where: { cartId: cart[0].id },
        include: [{ model: productModel }],
      })
      .then((cartItems) => cartItems);
  });
};

/* Cart Items Count */
const cartItemsCount = (cartItems) => {
  var count = 0;
  if (cartItems.length) {
    cartItems.forEach((item) => {
      count += item.quantity;
    });
  }
  return count;
};

/* Get Cart Total */
const getCartTotal = (cartItems) => {
  var total = 0;
  if (cartItems.length) {
    cartItems.forEach((item) => {
      total += item.quantity * item.Product.price;
    });
  }
  return total;
};

/* Exports all methods */
module.exports = {
  addToCart: addToCart,
  removeFromCart: removeFromCart,
  getCartItems: getCartItems,
  cartItemsCount: cartItemsCount,
  getCartTotal: getCartTotal,
  getCart: getCart,
  uniqueCartId: uniqueCartId,
};
