'use strict';

/**
 * Возвращает случайное число в диапазоне
 * `min` и `max`.
 *
 * @param {Number} min
 * @param {Number} max
 * @return {Number}
 */
const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Возвращает массив, содержащий случайное количество
 * элементов из переданного массива
 *
 * @param {Array} items
 * @return {Array}
 */
const getRandomSubarray = (items) => {
  items = items.slice();
  let count = getRandomInt(1, items.length - 1);
  const result = [];
  while (count--) {
    result.push(
        ...items.splice(
            getRandomInt(0, items.length - 1), 1
        )
    );
  }
  return result;
};

/**
 * Перетасовка массива по алгоритму
 * Фишера—Йетса.
 *
 * Функция возвращает новый массив
 *
 * @param {Array} someArray
 * @return {Array}
 */
const shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

/**
 * Функция разделяет строку с ошибками
 * и преобразует её в массив
 *
 * @param {Error} error
 * @return {Array}
 */
const prepareErrors = (error) => {
  return error.response.data.split(`\n`);
};

module.exports = {
  getRandomInt,
  getRandomSubarray,
  shuffle,
  prepareErrors
};
