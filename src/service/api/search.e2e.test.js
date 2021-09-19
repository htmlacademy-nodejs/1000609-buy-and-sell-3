'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const {HttpCode} = require(`../../constants`);
const initDB = require(`../lib/init-db`);
const passwordUtils = require(`../lib/password`);
const search = require(`./search`);
const DataService = require(`../data-service/search`);

const mockCategories = [
  `Книги`,
  `Разное`,
  `Посуда`,
  `Игры`,
  `Животные`,
  `Журналы`
];

const mockUsers = [
  {
    name: `Иван Иванов`,
    email: `ivanov@example.com`,
    passwordHash: passwordUtils.hashSync(`ivanov`),
    avatar: `avatar01.jpg`
  },
  {
    name: `Пётр Петров`,
    email: `petrov@example.com`,
    passwordHash: passwordUtils.hashSync(`petrov`),
    avatar: `avatar02.jpg`
  }
];

const mockOffers = [
  {
    "user": `ivanov@example.com`,
    "categories": [
      `Животные`,
      `Посуда`,
      `Книги`,
      `Разное`,
      `Журналы`
    ],
    "comments": [
      {
        "user": `petrov@example.com`,
        "text": `Неплохо, но дорого Вы что?! В магазине дешевле.`
      },
      {
        "user": `petrov@example.com`,
        "text": `Вы что?! В магазине дешевле. С чем связана продажа? Почему так дешёво?`
      },
      {
        "user": `petrov@example.com`,
        "text": `Оплата наличными или перевод на карту? Совсем немного...`
      },
      {
        "user": `ivanov@example.com`,
        "text": `Продаю в связи с переездом. Отрываю от сердца. А где блок питания?`
      }
    ],
    "description": `Продаю с болью в сердце... Если найдёте дешевле — сброшу цену. Даю недельную гарантию. При покупке с меня бесплатная доставка в черте города.`,
    "picture": `item16.jpg`,
    "title": `Отдам в хорошие руки подшивку «Мурзилка»`,
    "type": `OFFER`,
    "sum": 36951
  },
  {
    "user": `ivanov@example.com`,
    "categories": [
      `Разное`
    ],
    "comments": [
      {
        "user": `petrov@example.com`,
        "text": `Неплохо, но дорого Оплата наличными или перевод на карту?`
      }
    ],
    "description": `Это настоящая находка для коллекционера! Даю недельную гарантию. Товар в отличном состоянии. Не пытайтесь торговаться. Цену вещам я знаю.`,
    "picture": `item06.jpg`,
    "title": `Продам коллекцию журналов «Огонёк»`,
    "type": `SALE`,
    "sum": 6799
  },
  {
    "user": `ivanov@example.com`,
    "categories": [
      `Журналы`,
      `Игры`
    ],
    "comments": [
      {
        "user": `petrov@example.com`,
        "text": `А сколько игр в комплекте? Почему в таком ужасном состоянии?`
      },
      {
        "user": `petrov@example.com`,
        "text": `Оплата наличными или перевод на карту? А сколько игр в комплекте?`
      }
    ],
    "description": `Продаю с болью в сердце... Это настоящая находка для коллекционера! Мой дед не мог её сломать. Таких предложений больше нет!`,
    "picture": `item03.jpg`,
    "title": `Куплю антиквариат`,
    "type": `SALE`,
    "sum": 29098
  },
  {
    "user": `ivanov@example.com`,
    "categories": [
      `Посуда`,
      `Журналы`,
      `Игры`,
      `Животные`,
      `Книги`,
      `Разное`
    ],
    "comments": [
      {
        "user": `petrov@example.com`,
        "text": `С чем связана продажа? Почему так дешёво? Оплата наличными или перевод на карту?`
      },
      {
        "user": `petrov@example.com`,
        "text": `Совсем немного... А где блок питания?`
      },
      {
        "user": `petrov@example.com`,
        "text": `Почему в таком ужасном состоянии? Неплохо, но дорого`
      }
    ],
    "description": `Товар в отличном состоянии. Не пытайтесь торговаться. Цену вещам я знаю. Это настоящая находка для коллекционера! Кому нужен этот новый телефон, если тут такое...`,
    "picture": `item06.jpg`,
    "title": `Продам новую приставку Sony Playstation 5`,
    "type": `OFFER`,
    "sum": 15342
  },
  {
    "user": `petrov@example.com`,
    "categories": [
      `Журналы`
    ],
    "comments": [
      {
        "user": `ivanov@example.com`,
        "text": `Вы что?! В магазине дешевле. С чем связана продажа? Почему так дешёво?`
      }
    ],
    "description": `Если товар не понравится — верну всё до последней копейки. Бонусом отдам все аксессуары. Товар в отличном состоянии. Если найдёте дешевле — сброшу цену.`,
    "picture": `item16.jpg`,
    "title": `Продам отличную подборку фильмов на VHS`,
    "type": `OFFER`,
    "sum": 92592
  }
];

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});

const app = express();
app.use(express.json());

beforeAll(async () => {
  await initDB(mockDB, {categories: mockCategories, offers: mockOffers, users: mockUsers});
  search(app, new DataService(mockDB));
});

describe(`API returns offer based on search query`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/search`)
      .query({
        query: `Продам новую приставку`
      });
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`1 offer found`, () => expect(response.body.length).toBe(1));
  test(`Offer has correct title`, () => expect(response.body[0].title).toBe(`Продам новую приставку Sony Playstation 5`));
});

test(`API returns code 404 if nothing is found`, async () => {
  await request(app)
    .get(`/search`)
    .query({
      query: `Продам свою душу`
    })
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns 400 when query string is absent`, async () => {
  await request(app)
    .get(`/search`)
    .expect(HttpCode.BAD_REQUEST);
});
