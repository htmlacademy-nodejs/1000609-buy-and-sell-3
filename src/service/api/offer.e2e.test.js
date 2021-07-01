'use strict';

const express = require(`express`);
const request = require(`supertest`);

const {HttpCode} = require(`../../constants`);
const offer = require(`./offer`);
const DataService = require(`./../data-service/offer`);
const CommentService = require(`./../data-service/comment`);

const mockData = [
  {
    "id": `Ah8YRD`,
    "category": [
      `Игры`,
      `Посуда`,
      `Журналы`,
      `Животные`,
      `Разное`,
      `Книги`
    ],
    "comments": [
      {
        "id": `SvSBsD`,
        "text": `А где блок питания? Продаю в связи с переездом. Отрываю от сердца.`
      },
      {"id": `zS53LT`,
        "text": `Вы что?! В магазине дешевле. Совсем немного...`
      },
      {
        "id": `EPC8MK`,
        "text": `А сколько игр в комплекте? Неплохо, но дорого`
      }
    ],
    "description": `Если найдёте дешевле — сброшу цену. Даю недельную гарантию. Мой дед не мог её сломать. Не пытайтесь торговаться. Цену вещам я знаю.`,
    "picture": `item06.jpg`,
    "title": `Продам отличную подборку фильмов на VHS`,
    "type": `SALE`,
    "sum": 98394
  },
  {
    "id": `UdGwqt`,
    "category": [
      `Книги`
    ],
    "comments": [
      {
        "id": `N_Cqhm`,
        "text": `Продаю в связи с переездом. Отрываю от сердца. Оплата наличными или перевод на карту?`
      },
      {
        "id": `c03718`,
        "text": `А сколько игр в комплекте? Продаю в связи с переездом. Отрываю от сердца.`
      },
      {
        "id": `cUCh_D`,
        "text": `Почему в таком ужасном состоянии? Совсем немного...`
      }
    ],
    "description": `Если товар не понравится — верну всё до последней копейки. Не пытайтесь торговаться. Цену вещам я знаю. Это настоящая находка для коллекционера! Бонусом отдам все аксессуары.`,
    "picture": `item09.jpg`,
    "title": `Куплю детские санки`,
    "type": `SALE`,
    "sum": 68150
  },
  {
    "id": `LEJ5sB`,
    "category": [
      `Журналы`,
      `Разное`,
      `Книги`,
      `Игры`,
      `Посуда`
    ],
    "comments": [
      {
        "id": `8nqhTI`,
        "text": `Совсем немного... Оплата наличными или перевод на карту?`
      },
      {
        "id": `a8OMIj`,
        "text": `Вы что?! В магазине дешевле. С чем связана продажа? Почему так дешёво?`
      },
      {
        "id": `J10bsP`,
        "text": `Продаю в связи с переездом. Отрываю от сердца. Вы что?! В магазине дешевле.`
      },
      {
        "id": `s7JDAO`,
        "text": `Совсем немного... А где блок питания?`
      }
    ],
    "description": `Кому нужен этот новый телефон, если тут такое... Если найдёте дешевле — сброшу цену. Кажется, что это хрупкая вещь. При покупке с меня бесплатная доставка в черте города.`,
    "picture": `item06.jpg`,
    "title": `Продам коллекцию журналов «Огонёк»`,
    "type": `OFFER`,
    "sum": 96315
  },
  {
    "id": `nawOGP`,
    "category": [
      `Разное`,
      `Животные`,
      `Игры`,
      `Посуда`,
      `Журналы`
    ],
    "comments": [],
    "description": `Если найдёте дешевле — сброшу цену. Не пытайтесь торговаться. Цену вещам я знаю. Кому нужен этот новый телефон, если тут такое... Если товар не понравится — верну всё до последней копейки.`,
    "picture": `item08.jpg`,
    "title": `Куплю детские санки`,
    "type": `OFFER`,
    "sum": 20810
  },
  {
    "id": `GoXF4a`,
    "category": [
      `Книги`,
      `Журналы`,
      `Посуда`,
      `Разное`,
      `Игры`,
      `Животные`
    ],
    "comments": [
      {
        "id": `w1WBBW`,
        "text": `А где блок питания? Продаю в связи с переездом. Отрываю от сердца.`
      },
      {
        "id": `6KZJJ3`,
        "text": `С чем связана продажа? Почему так дешёво? Неплохо, но дорого`
      },
      {
        "id": `4KQAaE`,
        "text": `Неплохо, но дорого А где блок питания?`
      }
    ],
    "description": `Если товар не понравится — верну всё до последней копейки. Таких предложений больше нет! Это настоящая находка для коллекционера! Товар в отличном состоянии.`,
    "picture": `item06.jpg`,
    "title": `Продам отличную подборку фильмов на VHS`,
    "type": `OFFER`,
    "sum": 84499
  }
];

const createAPI = () => {
  const app = express();
  const clonedData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  offer(app, new DataService(clonedData), new CommentService());
  return app;
};

describe(`API returns a list of all offers`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/offers`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns a list of 5 offers`, () => expect(response.body.length).toBe(5));
  test(`First offer's id equals "Ah8YRD"`, () => expect(response.body[0].id).toBe(`Ah8YRD`));
});

describe(`API returns an offer with given id`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/offers/Ah8YRD`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Offer's title is "Продам отличную подборку фильмов на VHS"`, () => expect(response.body.title).toBe(`Продам отличную подборку фильмов на VHS`));
});

describe(`API creates an offer if data is valid`, () => {
  const newOffer = {
    category: `Котики`,
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500
  };

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/offers`)
      .send(newOffer);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns offer created`, () => expect(response.body).toEqual(
      expect.objectContaining(newOffer)
  ));
  test(`Offers count is changed`, async () => {
    await request(app)
      .get(`/offers`)
      .expect((res) => expect(res.body.length).toBe(6));
  });
});

describe(`API refuses to create an offer if data is invalid`, () => {
  const newOffer = {
    category: `Котики`,
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500
  };

  const app = createAPI();

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newOffer)) {
      const badOffer = {...newOffer};
      delete badOffer[key];
      await request(app)
        .post(`/offers`)
        .send(badOffer)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(` API changes existent offer`, () => {
  const newOffer = {
    category: `Котики`,
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500
  };

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .put(`/offers/Ah8YRD`)
      .send(newOffer);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns changed offer`, () => expect(response.body).toEqual(
      expect.objectContaining(newOffer)
  ));
  test(`Offer is really changed`, async () => {
    await request(app)
      .get(`/offers/Ah8YRD`)
      .expect((res) => expect(res.body.title).toBe(`Дам погладить котика`));
  });
});

test(`API returns status code 404 when trying to change non-existent offer`, async () => {
  const validOffer = {
    category: `Это`,
    title: `валидный`,
    description: `объект`,
    picture: `объявления`,
    type: `однако`,
    sum: 404
  };

  const app = createAPI();

  await request(app)
    .put(`/offers/NOEXST`)
    .send(validOffer)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an offer with invalid data`, async () => {
  const invalidOffer = {
    category: `Это`,
    title: `невалидный`,
    description: `объект`,
    picture: `объявления`,
    type: `нет поля sum`
  };

  const app = createAPI();

  await request(app)
    .put(`/offers/NOEXST`)
    .send(invalidOffer)
    .expect(HttpCode.BAD_REQUEST);
});
