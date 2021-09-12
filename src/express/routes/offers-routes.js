'use strict';

const {Router} = require(`express`);
const upload = require(`../middlewares/upload`);
const {prepareErrors} = require(`../../utils`);
const api = require(`../api`).getAPI();

const offersRouter = new Router();

const getEditOfferData = async (offerId) => {
  const [offer, categories] = await Promise.all([
    api.getOffer(offerId),
    api.getCategories()
  ]);
  return [offer, categories];
};

offersRouter.get(`/add`, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`offers/new-ticket`, {categories});
});

offersRouter.post(`/add`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;
  const offerData = {
    categories: Array.isArray(body.category) ? body.category : [body.category],
    description: body.comment,
    picture: file ? file.filename : ``,
    title: body[`ticket-name`],
    type: body.action,
    sum: body.price,
  };

  try {
    await api.createOffer(offerData);
    res.redirect(`/my`);
  } catch (err) {
    const validationMessages = prepareErrors(err);
    const categories = await api.getCategories();
    res.render(`offers/new-ticket`, {categories, validationMessages});
  }
});

offersRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const offer = await api.getOffer(id, true);

  res.render(`offers/ticket`, {id, offer});
});

offersRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [offer, categories] = await getEditOfferData(id);
  res.render(`offers/ticket-edit`, {id, offer, categories});
});

offersRouter.post(`/edit/:id`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;
  const {id} = req.params;
  const offerData = {
    picture: file ? file.filename : body[`old-image`],
    sum: body.price,
    type: body.action,
    description: body.comment,
    title: body[`ticket-name`],
    categories: Array.isArray(body.category) ? body.category : [body.category]
  };

  try {
    await api.editOffer(id, offerData);
    res.redirect(`/my`);
  } catch (err) {
    const validationMessages = prepareErrors(err);
    const [offer, categories] = await getEditOfferData(id);
    res.render(`offers/ticket-edit`, {id, offer, categories, validationMessages});
  }
});

offersRouter.post(`/:id/comments`, upload.single(`comment`), async (req, res) => {
  const {id} = req.params;
  const {comment} = req.body;

  try {
    await api.createComment(id, {text: comment});
    res.redirect(`/offers/${id}`);
  } catch (err) {
    const validationMessages = prepareErrors(err);
    const offer = await api.getOffer(id, true);
    res.render(`offers/ticket`, {id, offer, validationMessages});
  }
});

offersRouter.get(`/category/:id`, (req, res) => res.render(`category`));

module.exports = offersRouter;
