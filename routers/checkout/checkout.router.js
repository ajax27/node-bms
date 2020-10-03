'use strict'

const checkoutController = require('../../controllers/checkout.controller.js')
const express = require('express')
const router = express.Router()

/* Checkout Route */
router.all('/', checkoutController.checkout)
router.all('/receipt', checkoutController.receipt)

module.exports = router
