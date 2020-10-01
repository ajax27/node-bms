'use strict';

const catalogueController = require('../../controllers/catalogue.controller');
const express = require('express');
const router = express.Router();

/* Get Paged Product */
router.all('/', catalogueController.getPagedProducts);
router.get(
  '/catalogue/:category_slug/:brand_slug',
  catalogueController.getPagedProducts
);

/* Create New Product */
router.all('/new-product', catalogueController.createProduct);

/* Get Product Detail */
router.get('/product/:id/detail', catalogueController.getProduct);

/* Edit Product. */
router.all('/product/:id/edit', catalogueController.editProduct);

/* Delete Product. */
router.all('/product/:id/delete', catalogueController.deleteProduct);

module.exports = router;
