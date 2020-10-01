'use strict';

const db = require('../models/index');

const brand = require('../models/product/brand');
const category = require('../models/product/category');
const product = require('../models/product/product');
const productBrand = require('../models/product/productbrand');
const productCategory = require('../models/product/productcategory');

const brandModel = brand(db.sequelize, db.Sequelize.DataTypes);
const categoryModel = category(db.sequelize, db.Sequelize.DataTypes);
const productModel = product(db.sequelize, db.Sequelize.DataTypes);
const productBrandModel = productBrand(db.sequelize, db.Sequelize.DataTypes);
const productCategoryModel = productCategory(
  db.sequelize,
  db.Sequelize.DataTypes
);

brandModel.associate({
  Product: productModel,
  ProductBrand: productBrandModel,
});
categoryModel.associate({
  Product: productModel,
  ProductCategory: productCategoryModel,
});
productModel.associate({
  Brand: brandModel,
  Category: categoryModel,
  ProductBrand: productBrandModel,
  ProductCategory: productCategoryModel,
});

/* Fetch Products */
const fetchProducts = function (request, category_slug, brand_slug) {
  let pageObject = null;

  if (category_slug === 'all-categories' && brand_slug === 'all-brands') {
    pageObject = productModel.findAndCountAll({
      limit: request.query.limit,
      offset: request.skip,
      where: { isDeleted: false },
    });
  }

  if (category_slug !== 'all-categories' && brand_slug !== 'all-brands') {
    pageObject = productModel.findAndCountAll({
      limit: request.query.limit,
      offset: request.skip,
      where: { isDeleted: false },
      include: [
        { model: brandModel, where: { slug: brand_slug } },
        { model: categoryModel, where: { slug: category_slug } },
      ],
    });
  }

  if (category_slug !== 'all-categories' && brand_slug === 'all-brands') {
    pageObject = productModel.findAndCountAll({
      limit: request.query.limit,
      offset: request.skip,
      where: { isDeleted: false },
      include: [{ model: categoryModel, where: { slug: category_slug } }],
    });
  }

  if (category_slug === 'all-categories' && brand_slug !== 'all-brands') {
    pageObject = productModel.findAndCountAll({
      limit: request.query.limit,
      offset: request.skip,
      where: { isDeleted: false },
      include: [{ model: brandModel, where: { slug: brand_slug } }],
    });
  }

  return pageObject;
};

/* Fetch Categories */
const fetchCategories = () => {
  let categories = categoryModel.findAll({ where: { isDeleted: false } });

  return categories;
};

/* Fetch Brands */
const fetchBrands = () => {
  let brands = brandModel.findAll({ where: { isDeleted: false } });
  return brands;
};

/* Exports all methods */
module.exports = {
  fetchProducts: fetchProducts,
  fetchCategories: fetchCategories,
  fetchBrands: fetchBrands,
};
