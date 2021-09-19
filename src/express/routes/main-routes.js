'use strict';

const {Router} = require(`express`);
const upload = require(`../middlewares/upload`);
const {prepareErrors} = require(`../../utils`);
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

mainRouter.post(`/register`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;
  const userData = {
    avatar: file ? file.filename : ``,
    name: body[`user-name`],
    email: body[`user-email`],
    password: body[`user-password`],
    passwordRepeated: body[`user-password-again`]
  };

  try {
    await api.createUser(userData);
    res.redirect(`/login`);
  } catch (err) {
    const validationMessages = prepareErrors(err);
    res.render(`sign-up`, {validationMessages});
  }
});

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
