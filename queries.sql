-- Список всех категорий
SELECT * FROM categories;

-- Список категорий, для которых создано минимум одно объявление
SELECT id, name FROM categories
    JOIN offer_categories
    ON id = category_id
    GROUP BY id;

-- Список категорий с количеством объявлений
SELECT id, name, COUNT(offer_id) FROM categories
    LEFT JOIN offer_categories
    ON id = offer_categories.category_id
    GROUP BY id;

-- Список объявлений
SELECT offers.*,
    COUNT(DISTINCT comments.id) AS comments_counts,
    STRING_AGG(DISTINCT categories.name, ', ') AS category_list,
    users.first_name,
    users.last_name,
    users.email
FROM offers
    JOIN offer_categories ON offers.id = offer_categories.offer_id
    JOIN categories ON offer_categories.category_id = categories.id
    LEFT JOIN comments ON comments.offer_id = offers.id
    JOIN users ON users.id = offers.user_id
    GROUP BY offers.id, offers.created_at, users.id
    ORDER BY offers.created_at DESC;

-- Полная информация определённого объявления
SELECT offers.*,
    COUNT(DISTINCT comments.id) AS comments_count,
    STRING_AGG(DISTINCT categories.name, ', ') AS category_list,
    users.first_name,
    users.last_name,
    users.email
FROM offers
    JOIN offer_categories ON offers.id = offer_categories.offer_id
    JOIN categories ON offer_categories.category_id = categories.id
    LEFT JOIN comments ON comments.offer_id = offers.id
    JOIN users ON users.id = offers.user_id
WHERE offers.id = 1
    GROUP BY offers.id, users.id;

-- Список из 5 свежих комментариев
SELECT
    comments.id,
    comments.offer_id,
    users.first_name,
    users.last_name,
    comments.text
FROM comments
    JOIN users ON comments.user_id = users.id
    ORDER BY comments.created_at DESC
    LIMIT 5;

-- Список комментариев для определённого объявления
SELECT
    comments.id,
    comments.offer_id,
    users.first_name,
    users.last_name,
    comments.text
FROM comments
    JOIN users ON comments.user_id = users.id
WHERE comments.offer_id = 1
    ORDER BY comments.created_at DESC;

-- 2 объявления, соответствующие типу «куплю»
SELECT * FROM offers
WHERE type = 'OFFER'
    LIMIT 2;

-- Обновить заголовок определённого объявления на «Уникальное предложение!»
UPDATE offers
SET title = 'Уникальное предложение!'
WHERE id = 1;
