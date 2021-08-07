'use strict';

const chalk = require(`chalk`);

module.exports = {
  name: `--help`,
  run() {
    const text = `
    Программа запускает http-сервер и формирует файл с данными для api.
    Гайд:
      server <command>
      Команды:
      --version:            выводит номер версии
      --help:               печатает этот текст
      --filldb <count>:     заполняет таблицы в БД начальными данными
      --fill <count>:       формирует файл fill-db.sql
      --server <port>:      запускает http-сервер
    `;

    console.log(chalk.gray(text));
  }
};
