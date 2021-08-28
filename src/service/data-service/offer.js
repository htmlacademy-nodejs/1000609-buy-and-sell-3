'use strict';

const Alias = require(`../models/alias`);

class OfferService {
  constructor(sequelize) {
    this._Offer = sequelize.models.Offer;
  }

  async create(offerData) {
    const offer = await this._Offer.create(offerData);
    await offer.addCategories(offerData.categories);
    return offer.get();
  }

  async drop(id) {
    const deletedRows = await this._Offer.destroy({
      where: {id}
    });
    return !!deletedRows;
  }

  async findAll(needComments) {
    const include = [Alias.CATEGORIES];

    if (needComments) {
      include.push(Alias.COMMENTS);
    }

    const offers = await this._Offer.findAll({include});
    return offers.map((offer) => offer.get());
  }

  findOne(id, needComments) {
    const include = [Alias.CATEGORIES];

    if (needComments) {
      include.push(Alias.COMMENTS);
    }

    return this._Offer.findByPk(id, {include});
  }

  async findPage({limit, offset}) {
    const {count, rows} = await this._Offer.findAndCountAll({
      limit,
      offset,
      include: [Alias.CATEGORIES],
      order: [
        [`createdAt`, `DESC`]
      ],
      distinct: true
    });

    return {count, offers: rows};
  }

  async update(id, offer) {
    const [affectedRows] = await this._Offer.update(offer, {
      where: {id}
    });
    return !!affectedRows;
  }
}

module.exports = OfferService;
