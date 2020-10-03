'use strict'

const checkoutForm = require('../forms/checkout/checkout.form.js')
const checkoutService = require('../services/checkout.service.js')

const date = new Date()

/* Checkout */
const checkout = (req, res) => {
  if (req.method === 'POST') {
    checkoutService.processCheckout(req)
    res.redirect('/checkout/receipt')
  } else {
    res.render('checkout', {
      title: 'Checkout Page',
      year: date.getFullYear(),
      form: checkoutForm,
    })
  }
}

/* Receipt */
const receipt = (req, res) => {
  res.render('receipt', {
    title: 'Receipt Page',
    year: date.getFullYear(),
  })
}

/* Exports all methods */
module.exports = {
  checkout: checkout,
  receipt: receipt,
}
