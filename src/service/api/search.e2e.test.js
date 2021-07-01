'use strict';

const express = require(`express`);
const request = require(`supertest`);

const {HttpCode} = require(`../../constants`);
const search = require(`./search`);
const DataService = require(`../data-service/search`);

const mockData = [
  {
    "id": `4dmuyP`,
    "category": [
      `Животные`,
      `Посуда`,
      `Книги`,
      `Разное`,
      `Журналы`
    ],
    "comments": [
      {
        "id": `71Jg_J`,
        "text": `Неплохо, но дорого Вы что?! В магазине дешевле.`
      },
      {
        "id": `5mdObp`,
        "text": `Вы что?! В магазине дешевле. С чем связана продажа? Почему так дешёво?`
      },
      {
        "id": `utx6-u`,
        "text": `Оплата наличными или перевод на карту? Совсем немного...`
      },
      {
        "id": `F3AoD6`,
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
    "id": `Eb6qPF`,
    "category": [
      `Разное`
    ],
    "comments": [
      {
        "id": `H3c22D`,
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
    "id": `aqjItr`,
    "category": [
      `Журналы`,
      `Игры`
    ],
    "comments": [
      {
        "id": `8ElHyL`,
        "text": `А сколько игр в комплекте? Почему в таком ужасном состоянии?`
      },
      {
        "id": `I8jwz8`,
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
    "id": `o0IC7c`,
    "category": [
      `Посуда`,
      `Журналы`,
      `Игры`,
      `Животные`,
      `Книги`,
      `Разное`
    ],
    "comments": [
      {
        "id": `DR_RUz`,
        "text": `С чем связана продажа? Почему так дешёво? Оплата наличными или перевод на карту?`
      },
      {
        "id": `40VxZA`,
        "text": `Совсем немного... А где блок питания?`
      },
      {
        "id": `yhWioQ`,
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
    "id": `ufNpVF`,
    "category": [
      `Журналы`
    ],
    "comments": [
      {
        "id": `Fw-qkr`,
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

const app = express();
app.use(express.json());
search(app, new DataService(mockData));

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
  test(`Offer has correct id`, () => expect(response.body[0].id).toBe(`o0IC7c`));
});

test(`API returns code 404 if nothing is found`, () => {
  request(app)
    .get(`/search`)
    .query({
      query: `Продам свою душу`
    })
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns 400 when query string is absent`, () => {
  request(app)
    .get(`/search`)
    .expect(HttpCode.BAD_REQUEST);
});
