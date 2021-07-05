'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();

const offersRouter = new Router();

offersRouter.get(`/add`, (req, res) => res.render(`offers/new-ticket`));
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
