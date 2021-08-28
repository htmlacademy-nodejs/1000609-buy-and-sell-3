'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();

const OFFERS_PER_PAGE = 8;

const mainRouter = new Router();

mainRouter.get(`/`, async (req, res) => {
  let {page = 1} = req.query;
  page = +page;
  const limit = OFFERS_PER_PAGE;
  const offset = (page - 1) * OFFERS_PER_PAGE;

  const [{count, offers}, categories] = await Promise.all([api.getOffers({limit, offset}), api.getCategories(true)]);
  const totalPages = Math.ceil(count / OFFERS_PER_PAGE);
  res.render(`main`, {offers, categories, page, totalPages});
});
mainRouter.get(`/register`, (req, res) => res.render(`sign-up`));
mainRouter.get(`/login`, (req, res) => res.render(`login`));
mainRouter.get(`/search`, async (req, res) => {
  const {search} = req.query;

  try {
    const results = await api.search(search);

    res.render(`search-result`, {results, search});
  } catch (error) {
    res.render(`search-result`, {results: [], search});
  }
});

module.exports = mainRouter;
