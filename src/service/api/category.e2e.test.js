'use strict';

const express = require(`express`);
const request = require(`supertest`);

const {HttpCode} = require(`../../constants`);
const category = require(`./category`);
const DataService = require(`../data-service/category`);

const mockData = [
  {
    "id": `iuuB9A`,
    "category": [
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
    "id": `T4hTD1`,
    "category": [
      `Животные`,
      `Посуда`,
      `Разное`,
      `Игры`,
    ],
    "comments": [
      {
        "id": `JFWjSJ`,
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
    "id": `z2id4p`,
    "category": [
      `Посуда`
    ],
    "comments": [
      {
        "id": `nISikf`,
        "text": `Совсем немного... С чем связана продажа? Почему так дешёво?`
      },
      {
        "id": `VSnl9A`,
        "text": `А сколько игр в комплекте? Неплохо, но дорого`
      },
      {
        "id": `7cEHYX`,
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
    "id": `jr93Bw`,
    "category": [
      `Посуда`,
      `Разное`
    ],
    "comments": [
      {
        "id": `XmkYo1`,
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
    "id": `mlElA7`,
    "category": [
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

const app = express();
app.use(express.json());
category(app, new DataService(mockData));

describe(`API returns category list`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/category`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 3 categories`, () => expect(response.body.length).toBe(4));
  test(`Category names are "Посуда", "Игры", "Животные", "Разное"`, () => {
    expect(response.body).toEqual(
        expect.arrayContaining([`Посуда`, `Игры`, `Животные`, `Разное`])
    );
  });
});
