'use strict';

const cartController = require('../../controllers/cart.controller');
const express = require('express');
const router = express.Router();

/* Cart Routes */
router.all('/', cartController.cartDetail);

module.exports = router;
