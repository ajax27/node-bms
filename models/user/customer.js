'use strict'

const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Customer.belongsTo(models.Person)
      Customer.belongsToMany(models.Address, {
        through: models.CustomerAddress,
      })
    }
  }
  Customer.init(
    {
      personId: DataTypes.INTEGER,
      isDeleted: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Customer',
    }
  )
  return Customer
}
