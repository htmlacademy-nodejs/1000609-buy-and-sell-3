'use strict';

const {Router} = require(`express`);
const upload = require(`../middlewares/upload`);
const api = require(`../api`).getAPI();

const offersRouter = new Router();

offersRouter.get(`/add`, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`offers/new-ticket`, {categories});
});

offersRouter.post(`/add`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;
  const offerData = {
    category: Array.isArray(body.category) ? body.category : [body.category],
    description: body.comment,
    picture: file.filename,
    title: body[`ticket-name`],
    type: body.action,
    sum: body.price,
  };

  try {
    await api.createOffer(offerData);
    res.redirect(`/my`);
  } catch (e) {
    res.redirect(`back`);
  }
});

offersRouter.get(`/:id`, (req, res) => res.render(`offers/ticket`));

offersRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [offer, categories] = await Promise.all([
    api.getOffer(id),
    api.getCategories()
  ]);
  res.render(`offers/ticket-edit`, {offer, categories});
});

offersRouter.get(`/category/:id`, (req, res) => res.render(`category`));

module.exports = offersRouter;
