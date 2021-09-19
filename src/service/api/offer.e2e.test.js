'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const {HttpCode} = require(`../../constants`);
const initDB = require(`../lib/init-db`);
const passwordUtils = require(`../lib/password`);
const offer = require(`./offer`);
const DataService = require(`./../data-service/offer`);
const CommentService = require(`./../data-service/comment`);

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
    "user": `petrov@example.com`,
    "categories": [
      `Игры`,
      `Посуда`,
      `Журналы`,
      `Животные`,
      `Разное`,
      `Книги`
    ],
    "comments": [
      {
        "user": `ivanov@example.com`,
        "text": `А где блок питания? Продаю в связи с переездом. Отрываю от сердца.`
      },
      {
        "user": `petrov@example.com`,
        "text": `Вы что?! В магазине дешевле. Совсем немного...`
      },
      {
        "user": `ivanov@example.com`,
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
    "user": `ivanov@example.com`,
    "categories": [
      `Книги`
    ],
    "comments": [
      {
        "user": `petrov@example.com`,
        "text": `Продаю в связи с переездом. Отрываю от сердца. Оплата наличными или перевод на карту?`
      },
      {
        "user": `petrov@example.com`,
        "text": `А сколько игр в комплекте? Продаю в связи с переездом. Отрываю от сердца.`
      },
      {
        "user": `petrov@example.com`,
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
    "user": `petrov@example.com`,
    "categories": [
      `Журналы`,
      `Разное`,
      `Книги`,
      `Игры`,
      `Посуда`
    ],
    "comments": [
      {
        "user": `ivanov@example.com`,
        "text": `Совсем немного... Оплата наличными или перевод на карту?`
      },
      {
        "user": `petrov@example.com`,
        "text": `Вы что?! В магазине дешевле. С чем связана продажа? Почему так дешёво?`
      },
      {
        "user": `petrov@example.com`,
        "text": `Продаю в связи с переездом. Отрываю от сердца. Вы что?! В магазине дешевле.`
      },
      {
        "user": `ivanov@example.com`,
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
    "user": `ivanov@example.com`,
    "categories": [
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
    "user": `petrov@example.com`,
    "categories": [
      `Книги`,
      `Журналы`,
      `Посуда`,
      `Разное`,
      `Игры`,
      `Животные`
    ],
    "comments": [
      {
        "user": `ivanov@example.com`,
        "text": `А где блок питания? Продаю в связи с переездом. Отрываю от сердца.`
      },
      {
        "user": `ivanov@example.com`,
        "text": `С чем связана продажа? Почему так дешёво? Неплохо, но дорого`
      },
      {
        "user": `ivanov@example.com`,
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

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, {categories: mockCategories, offers: mockOffers, users: mockUsers});
  const app = express();
  app.use(express.json());
  offer(app, new DataService(mockDB), new CommentService(mockDB));
  return app;
};

describe(`API returns a list of all offers`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/offers`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns a list of 5 offers`, () => expect(response.body.length).toBe(5));
});

describe(`API returns an offer with given id`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/offers/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Offer's title is "Продам отличную подборку фильмов на VHS"`, () => {
    expect(response.body.title).toBe(`Продам отличную подборку фильмов на VHS`);
  });
});

describe(`API creates an offer if data is valid`, () => {
  const newOffer = {
    categories: [1, 2],
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф. К лотку приучен.`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500,
    userId: 1
  };

  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .post(`/offers`)
      .send(newOffer);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Offers count is changed`, async () => {
    await request(app)
      .get(`/offers`)
      .expect((res) => expect(res.body.length).toBe(6));
  });
});

describe(`API refuses to create an offer if data is invalid`, () => {
  const newOffer = {
    categories: [1],
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф. К лотку приучен.`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500,
    userId: 1
  };

  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

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

  test(`When field type is wrong response code is 400`, async () => {
    const badOffers = [
      {...newOffer, sum: true},
      {...newOffer, picture: 12345},
      {...newOffer, categories: `Котики`}
    ];

    for (const badOffer of badOffers) {
      await request(app)
        .post(`/offers`)
        .send(badOffer)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`When field value is wrong response code is 400`, async () => {
    const badOffers = [
      {...newOffer, sum: -1},
      {...newOffer, title: `too short`},
      {...newOffer, categories: []}
    ];

    for (const badOffer of badOffers) {
      await request(app)
        .post(`/offers`)
        .send(badOffer)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes existent offer`, () => {
  const newOffer = {
    categories: [2],
    title: `Дам погладить котика`,
    description: `Дам погладить котика. Дорого. Не гербалайф. К лотку приучен.`,
    picture: `cat.jpg`,
    type: `OFFER`,
    sum: 100500,
    userId: 1
  };

  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .put(`/offers/2`)
      .send(newOffer);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Offer is really changed`, async () => {
    await request(app)
      .get(`/offers/2`)
      .expect((res) => expect(res.body.title).toBe(`Дам погладить котика`));
  });
});

test(`API returns status code 404 when trying to change non-existent offer`, async () => {
  const validOffer = {
    categories: [3],
    title: `Это валидный`,
    description: `объект объявления, однако поскольку такого объявления в базе нет`,
    picture: `мы получим 404`,
    type: `SALE`,
    sum: 404,
    userId: 1
  };

  const app = await createAPI();

  await request(app)
    .put(`/offers/20`)
    .send(validOffer)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an offer with invalid data`, async () => {
  const invalidOffer = {
    categories: [1, 2],
    title: `Это невалидный`,
    description: `объект`,
    picture: `объявления`,
    type: `нет поля sum`,
    userId: 1
  };

  const app = await createAPI();

  await request(app)
    .put(`/offers/3`)
    .send(invalidOffer)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an offer`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .delete(`/offers/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Offers count is 4 now`, async () => {
    await request(app)
      .get(`/offers`)
      .expect((res) => expect(res.body.length).toBe(4));
  });
});

test(`API refuses to delete non-existent offer`, async () => {
  const app = await createAPI();

  await request(app)
    .delete(`/offers/20`)
    .expect(HttpCode.NOT_FOUND);
});

describe(`API returns a list of comments to given offer`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/offers/2/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 3 comments`, () => expect(response.body.length).toBe(3));
  test(`First comment's text is "Продаю в связи с переездом. Отрываю от сердца. Оплата наличными или перевод на карту?"`, () => {
    expect(response.body[0].text).toBe(`Продаю в связи с переездом. Отрываю от сердца. Оплата наличными или перевод на карту?`);
  });
});

describe(`API creates a comment if data is valid`, () => {
  const newComment = {
    text: `Валидному комментарию достаточно этих полей`,
    userId: 1
  };

  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .post(`/offers/3/comments`)
      .send(newComment);
  });


  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Comments count is changed`, async () => {
    await request(app)
        .get(`/offers/3/comments`)
        .expect((res) => expect(res.body.length).toBe(5));
  });
});

test(`API refuses to create a comment to non-existent offer and returns status code 404`, async () => {
  const app = await createAPI();

  await request(app)
    .post(`/offers/20/comments`)
    .send({
      text: `Неважно`
    })
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, async () => {
  const invalidComment = {
    text: `Не указан userId`
  };

  const app = await createAPI();

  await request(app)
    .post(`/offers/2/comments`)
    .send(invalidComment)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes a comment`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .delete(`/offers/1/comments/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Comments count is 2 now`, async () => {
    await request(app)
        .get(`/offers/1/comments`)
        .expect((res) => expect(res.body.length).toBe(2));
  });
});

test(`API refuses to delete non-existent comment`, async () => {
  const app = await createAPI();

  await request(app)
    .delete(`/offers/4/comments/100`)
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to delete a comment to non-existent offer`, async () => {
  const app = await createAPI();

  await request(app)
    .delete(`/offers/20/comments/1`)
    .expect(HttpCode.NOT_FOUND);
});
