'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const {HttpCode} = require(`../../constants`);
const initDB = require(`../lib/init-db`);
const passwordUtils = require(`../lib/password`);
const category = require(`./category`);
const DataService = require(`../data-service/category`);

const mockCategories = [
  `Посуда`,
  `Разное`,
  `Игры`,
  `Животные`
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
      `Игры`
    ],
    "comments": [],
    "description": `Даю недельную гарантию. Бонусом отдам все аксессуары. Товар в отличном состоянии. Две страницы заляпаны свежим кофе.`,
    "picture": `item08.jpg`,
    "title": `Продам книги Стивена Кинга`,
    "type": `SALE`,
    "sum": 33093
  },
  {
    "user": `ivanov@example.com`,
    "categories": [
      `Животные`,
      `Посуда`,
      `Разное`,
      `Игры`,
    ],
    "comments": [
      {
        "user": `petrov@example.com`,
        "text": `Оплата наличными или перевод на карту? Почему в таком ужасном состоянии?`
      }
    ],
    "description": `Не пытайтесь торговаться. Цену вещам я знаю. Пользовались бережно и только по большим праздникам. Если товар не понравится — верну всё до последней копейки. Бонусом отдам все аксессуары.`,
    "picture": `item12.jpg`,
    "title": `Отдам в хорошие руки подшивку «Мурзилка»`,
    "type": `OFFER`,
    "sum": 58222
  },
  {
    "user": `petrov@example.com`,
    "categories": [
      `Посуда`
    ],
    "comments": [
      {
        "user": `ivanov@example.com`,
        "text": `Совсем немного... С чем связана продажа? Почему так дешёво?`
      },
      {
        "user": `ivanov@example.com`,
        "text": `А сколько игр в комплекте? Неплохо, но дорого`
      },
      {
        "user": `petrov@example.com`,
        "text": `Совсем немного... С чем связана продажа? Почему так дешёво?`
      }
    ],
    "description": `Пользовались бережно и только по большим праздникам. Если найдёте дешевле — сброшу цену. Продаю с болью в сердце... При покупке с меня бесплатная доставка в черте города.`,
    "picture": `item15.jpg`,
    "title": `Продам книги Стивена Кинга`,
    "type": `OFFER`,
    "sum": 51034
  },
  {
    "user": `petrov@example.com`,
    "categories": [
      `Посуда`,
      `Разное`
    ],
    "comments": [
      {
        "user": `petrov@example.com`,
        "text": `А сколько игр в комплекте? Продаю в связи с переездом. Отрываю от сердца.`
      }
    ],
    "description": `Кажется, что это хрупкая вещь. При покупке с меня бесплатная доставка в черте города. Не пытайтесь торговаться. Цену вещам я знаю. Две страницы заляпаны свежим кофе.`,
    "picture": `item01.jpg`,
    "title": `Куплю детские санки`,
    "type": `SALE`,
    "sum": 16244
  },
  {
    "user": `ivanov@example.com`,
    "categories": [
      `Животные`,
      `Разное`,
      `Игры`,
      `Посуда`
    ],
    "comments": [],
    "description": `Это настоящая находка для коллекционера! Не пытайтесь торговаться. Цену вещам я знаю. Кому нужен этот новый телефон, если тут такое... Пользовались бережно и только по большим праздникам.`,
    "picture": `item05.jpg`,
    "title": `Продам книги Стивена Кинга`,
    "type": `SALE`,
    "sum": 93733
  }
];

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});

const app = express();
app.use(express.json());

beforeAll(async () => {
  await initDB(mockDB, {categories: mockCategories, offers: mockOffers, users: mockUsers});
  category(app, new DataService(mockDB));
});

describe(`API returns category list`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/category`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 4 categories`, () => expect(response.body.length).toBe(4));
  test(`Category names are "Посуда", "Игры", "Животные", "Разное"`, () => {
    expect(response.body.map((it) => it.name)).toEqual(
        expect.arrayContaining([`Посуда`, `Игры`, `Животные`, `Разное`])
    );
  });
});
