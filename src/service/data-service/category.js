'use strict';

const Sequelize = require(`sequelize`);
const Alias = require(`../models/alias`);

class CategoryService {
  constructor(sequelize) {
    this._Category = sequelize.models.Category;
    this._OfferCategory = sequelize.models.OfferCategory;
  }

  async findAll(needCount) {
    if (needCount) {
      const result = await this._Category.findAll({
        attributes: [
          `id`,
          `name`,
          [
            Sequelize.fn(`COUNT`, `*`), `count`
          ]
        ],
        group: [Sequelize.col(`Category.id`)],
        include: [{
          model: this._OfferCategory,
          as: Alias.OFFER_CATEGORIES,
          attributes: []
        }]
      });

      return result.map((it) => it.get());
    }

    return this._Category.findAll({raw: true});
  }
}

module.exports = CategoryService;
