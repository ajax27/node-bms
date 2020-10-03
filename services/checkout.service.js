'use strict'

const db = require('../models/index')

const checkoutForm = require('../forms/checkout/checkout.form')

const product = require('../models/product/product')
const cart = require('../models/cart/cart')
const cartItem = require('../models/cart/cartitem')

const order = require('../models/order/order')
const orderItem = require('../models/order/orderitem')

const address = require('../models/location/address')

const person = require('../models/user/person')
const customer = require('../models/user/customer')

const customerAddress = require('../models/user/customeraddress')

const cartService = require('./cart.service')

const cartModel = cart(db.sequelize, db.Sequelize.DataTypes)
const cartItemModel = cartItem(db.sequelize, db.Sequelize.DataTypes)
const productModel = product(db.sequelize, db.Sequelize.DataTypes)

const orderModel = order(db.sequelize, db.Sequelize.DataTypes)
const orderItemModel = orderItem(db.sequelize, db.Sequelize.DataTypes)
const addressModel = address(db.sequelize, db.Sequelize.DataTypes)
const personModel = person(db.sequelize, db.Sequelize.DataTypes)
const customerModel = customer(db.sequelize, db.Sequelize.DataTypes)
const customerAddressModel = customerAddress(
  db.sequelize,
  db.Sequelize.DataTypes
)

//Associate The Models
cartModel.associate({ CartItem: cartItemModel })
cartItemModel.associate({ Cart: cartModel, Product: productModel })

customerModel.associate({
  Address: addressModel,
  Person: personModel,
  CustomerAddress: customerAddressModel,
})

orderModel.associate({
  OrderItem: orderItemModel,
  Address: addressModel,
  Customer: customerModel,
})
orderItemModel.associate({ Order: orderModel, Product: productModel })

/* Process Checkout */
const processCheckout = function (request) {
  checkoutForm.handle(request, {
    success: function (form) {
      personModel
        .create({
          firstName: form.data.firstName,
          middleName: form.data.middleName,
          lastName: form.data.lastName,
          emailAddress: form.data.email,
          isDeleted: false,
        })
        .then((person) => {
          addressModel
            .create({
              addressLine1: form.data.addressLine1,
              addressLine2: form.data.addressLine2,
              city: form.data.city,
              state: form.data.state,
              country: form.data.country,
              zipCode: form.data.zipCode,
              isDeleted: false,
            })
            .then((address) => {
              customerModel
                .create({
                  personId: person.id,
                  isDeleted: false,
                })
                .then((customer) => {
                  customerAddressModel.create({
                    customerId: customer.id,
                    addressId: address.id,
                  })

                  cartService.getCart(request).then((cart) => {
                    if (cart) {
                      cartService.getCartItems(request).then((items) => {
                        const cartTotal = cartService.getCartTotal(items)
                        let shippingCharge = 0.0
                        const orderTotal = cartTotal + shippingCharge

                        orderModel
                          .create({
                            orderTotal: orderTotal,
                            orderItemTotal: cartTotal,
                            shippingCharge: shippingCharge,
                            deliveryAddressId: address.id,
                            customerId: customer.id,
                          })
                          .then((order) => {
                            items.forEach((item) => {
                              orderItemModel.create({
                                quantity: item.quantity,
                                price: item.Product.price,
                                orderId: order.id,
                                productId: item.Product.id,
                              })
                            })
                          })
                          .then(() => {
                            cartModel.destroy({
                              force: true,
                              where: { id: cart[0].id },
                            })
                          })
                      })
                    }
                  })
                })
            })
        })
    },
  })
}

/* Exports all methods */
module.exports = {
  processCheckout: processCheckout,
}
