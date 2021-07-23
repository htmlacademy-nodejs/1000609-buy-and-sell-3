'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {ExitCode} = require(`../../constants`);
const {getRandomInt, shuffle} = require(`../../utils`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `fill-db.sql`;

const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const PictureRestrict = {
  MIN: 1,
  MAX: 16
};

const OfferType = {
  OFFER: `offer`,
  SALE: `sale`,
};

const SumRestrict = {
  MIN: 1000,
  MAX: 100000,
};

const CommentsRestrict = {
  MIN: 1,
  MAX: 4,
};

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const generateComments = (count, offerId, userCount, comments) => (
  Array.from({length: count}, () => ({
    userId: getRandomInt(1, userCount),
    offerId,
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }))
);

const getPictureFileName = (number) => `item${number.toString().padStart(2, `0`)}.jpg`;

const generateOffers = (count, titles, categoryCount, userCount, sentences, comments) => (
  Array.from({length: count}, (_, index) => ({
    category: [getRandomInt(1, categoryCount)],
    comments: generateComments(getRandomInt(CommentsRestrict.MIN, CommentsRestrict.MAX), index + 1, userCount, comments),
    description: shuffle(sentences).slice(1, 5).join(` `),
    picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
    title: titles[getRandomInt(0, titles.length - 1)],
    type: Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)],
    sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
    userId: getRandomInt(1, userCount)
  }))
);

module.exports = {
  name: `--fill`,
  async run(args) {
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const commentSentences = await readContent(FILE_COMMENTS_PATH);
    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;

    const users = [
      {
        email: `ivanov@example.com`,
        passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
        firstName: `Иван`,
        lastName: `Иванов`,
        avatar: `avatar1.jpg`
      },
      {
        email: `petrov@example.com`,
        passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
        firstName: `Пётр`,
        lastName: `Петров`,
        avatar: `avatar2.jpg`
      }
    ];

    const offers = generateOffers(countOffer, titles, categories.length, users.length, sentences, commentSentences);

    const comments = offers.flatMap((offer) => offer.comments);

    const offerCategories = offers.map((offer, index) => ({offerId: index + 1, categoryId: offer.category[0]}));

    const userValues = users.map(({email, passwordHash, firstName, lastName, avatar}) => {
      return `('${email}', '${passwordHash}', '${firstName}', '${lastName}', '${avatar}')`;
    }).join(`,\n`);

    const categoryValues = categories.map((name) => `('${name}')`).join(`,\n`);

    const offerValues = offers.map(({title, description, type, sum, picture, userId}) => {
      return `('${title}', '${description}', '${type}', ${sum}, '${picture}', ${userId})`;
    }).join(`,\n`);

    const offerCategoryValues = offerCategories.map(({offerId, categoryId}) => `(${offerId}, ${categoryId})`).join(`,\n`);

    const commentValues = comments.map(({text, userId, offerId}) => `('${text}', ${userId}, ${offerId})`).join(`,\n`);

    const content = `INSERT INTO users(email, password_hash, first_name, last_name, avatar) VALUES
${userValues};

INSERT INTO categories(name) VALUES
${categoryValues};

INSERT INTO offers(title, description, type, sum, picture, user_id) VALUES
${offerValues};

INSERT INTO offer_categories(offer_id, category_id) VALUES
${offerCategoryValues};

INSERT INTO comments(text, user_id, offer_id) VALUES
${commentValues};`;

    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));
      process.exit(ExitCode.SUCCESS);
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
      process.exit(ExitCode.ERROR);
    }
  }
};
