'use strict';

const {Model} = require(`sequelize`);
const Alias = require(`./alias`);
const defineCategory = require(`./category`);
const defineComment = require(`./comment`);
const defineOffer = require(`./offer`);

class OfferCategory extends Model {}

const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Offer = defineOffer(sequelize);

  Offer.hasMany(Comment, {as: Alias.COMMENTS, foreignKey: `offerId`});
  Comment.belongsTo(Offer, {foreignKey: `offerId`});

  OfferCategory.init({}, {sequelize});

  Offer.belongsToMany(Category, {through: OfferCategory, as: Alias.CATEGORIES});
  Offer.hasMany(OfferCategory, {as: Alias.OFFER_CATEGORIES});
  Category.belongsToMany(Offer, {through: OfferCategory, as: Alias.OFFERS});
  Category.hasMany(OfferCategory, {as: Alias.OFFER_CATEGORIES});

  return {Category, Comment, Offer, OfferCategory};
};

module.exports = define;
