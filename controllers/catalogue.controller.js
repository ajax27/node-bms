'use strict';

const catalogueService = require('../services/catalogue.service');
// const cartService = require('../services/cart.service');
const date = new Date();

/* Get all products */
const getPagedProducts = (req, res) => {
  if (req.method === 'POST') {
    cartService.addToCart(req);
    res.redirect(req.body.originalUrl);
  } else {
    fetchPaginatedProducts(req, res);
  }
};

/* Create a new product */
const createProduct = (req, res) => {
  if (req.method === 'POST') {
    res.redirect('/');
  } else {
    res.redirect('/');
  }
};

/* Get Product */
const getProduct = (req, res) => {
  res.redirect('/');
};

/* Update Product */
const editProduct = (req, res) => {
  if (req.method === 'POST') {
    res.redirect('/');
  } else {
    res.redirect('/');
  }
};

/* Delete Product */
const deleteProduct = function (req, res) {
  res.redirect('/');
};

const fetchPaginatedProducts = function (req, res) {
  const selectedCategory = req.params.category_slug
    ? req.params.category_slug
    : 'all-categories';
  const selectedBrand = req.params.brand_slug
    ? req.params.brand_slug
    : 'all-brands';

  catalogueService
    .fetchProducts(req, selectedCategory, selectedBrand)
    .then((pageObject) => {
      catalogueService.fetchCategories().then((categories) => {
        catalogueService.fetchBrands().then((brands) => {
          const itemCount = pageObject.count;
          const pageCount = Math.ceil(pageObject.count / req.query.limit);
          res.render('catalogue', {
            title: 'Product List',
            year: date.getFullYear(),
            page_object: pageObject.rows,
            pageCount: pageCount,
            itemCount: itemCount,
            pages: res.locals.paginate.getArrayPages(
              5,
              pageCount,
              req.query.page
            ),
            categories: categories,
            brands: brands,
            selected_category: selectedCategory,
            selected_brand: selectedBrand,
            originalUrl: req.originalUrl,
          });
        });
      });
    });
};

/* Exports all methods */
module.exports = {
  getPagedProducts: getPagedProducts,
  createProduct: createProduct,
  getProduct: getProduct,
  editProduct: editProduct,
  deleteProduct: deleteProduct,
};
