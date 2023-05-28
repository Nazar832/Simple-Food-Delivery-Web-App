CREATE DATABASE food_delivery;

CREATE TABLE "User" (
  id serial PRIMARY KEY,
  name varchar NOT NULL,
  email varchar NOT NULL,
  phone varchar(20) NOT NULL,
  address varchar NOT NULL
);

CREATE TABLE Shop (
  id serial PRIMARY KEY,
  name varchar UNIQUE NOT NULL
);

CREATE TABLE FoodItem (
  id serial PRIMARY KEY,
  name varchar NOT NULL,
  price real NOT NULL,
  image_name varchar NOT NULL,
  shop_id integer NOT NULL
);

CREATE TABLE OrderItem (
  id serial PRIMARY KEY,
  quantity integer NOT NULL,
  food_item_id integer NOT NULL,
  order_id integer NOT NULL
);

CREATE TABLE "Order" (
  id serial PRIMARY KEY,
  user_id integer NOT NULL
);

ALTER TABLE FoodItem ADD FOREIGN KEY (shop_id) REFERENCES Shop (id);

ALTER TABLE OrderItem ADD FOREIGN KEY (food_item_id) REFERENCES FoodItem (id);

ALTER TABLE OrderItem ADD FOREIGN KEY (order_id) REFERENCES "Order" (id);

ALTER TABLE "Order" ADD FOREIGN KEY (user_id) REFERENCES "User" (id);

INSERT INTO Shop(name) VALUES ('McDonald''s');
INSERT INTO Shop(name) VALUES ('KFC');
INSERT INTO Shop(name) VALUES ('Burger King');
INSERT INTO Shop(name) VALUES ('Domino''s');

INSERT INTO FoodItem(name, price, image_name, shop_id) VALUES ('Cheeseburger', 4, 'Mc-cheeseburger.jpg', 1);
INSERT INTO FoodItem(name, price, image_name, shop_id) VALUES ('Big Mac', 8, 'Mc-BigMac.jpg', 1);
INSERT INTO FoodItem(name, price, image_name, shop_id) VALUES ('McDouble', 6.5, 'Mc-McDouble.jpg', 1);
INSERT INTO FoodItem(name, price, image_name, shop_id) VALUES ('World Famous Fries', 3.5, 'Mc-WorldFamousFries.jpg_large', 1);
INSERT INTO FoodItem(name, price, image_name, shop_id) VALUES ('Cappuccino', 4, 'Mc-Cappuccino.jpg', 1);

INSERT INTO FoodItem(name, price, image_name, shop_id) VALUES ('Fried Chicken', 3, 'KFC-FriedChicken.jpg', 2);
INSERT INTO FoodItem(name, price, image_name, shop_id) VALUES ('Zinger Burger', 5, 'KFC-ZingerBurger.jpg', 2);
INSERT INTO FoodItem(name, price, image_name, shop_id) VALUES ('Fries', 3, 'KFC-Fries.jpg', 2);
INSERT INTO FoodItem(name, price, image_name, shop_id) VALUES ('Nuggets', 6.5, 'KFC-Nuggets.webp', 2);

INSERT INTO FoodItem(name, price, image_name, shop_id) VALUES ('Crispy Veg', 3, 'BK-CrispyVeg.jpg', 3);
INSERT INTO FoodItem(name, price, image_name, shop_id) VALUES ('Chicken Whopper', 7, 'BK-ChickenWhopper.jpg', 3);
INSERT INTO FoodItem(name, price, image_name, shop_id) VALUES ('BK Grill Chicken', 4, 'BK-GrillChicken.jpg', 3);
INSERT INTO FoodItem(name, price, image_name, shop_id) VALUES ('Panner King', 6.5, 'BK-PannerKing.webp', 3);

INSERT INTO FoodItem(name, price, image_name, shop_id) VALUES ('Hawaiian', 10, 'Ds-Hawaiian.jpg', 4);
INSERT INTO FoodItem(name, price, image_name, shop_id) VALUES ('Vegetariana', 7.5, 'Ds-Vegetariana.jpg', 4);
INSERT INTO FoodItem(name, price, image_name, shop_id) VALUES ('Margherita', 8.5, 'Ds-Margherita.jpg', 4);
INSERT INTO FoodItem(name, price, image_name, shop_id) VALUES ('Cheese & Ham', 8, 'Ds-Cheese&Ham.jpg', 4);
INSERT INTO FoodItem(name, price, image_name, shop_id) VALUES ('Tuna Delight', 9, 'Ds-TunaDelight.jpg', 4);
INSERT INTO FoodItem(name, price, image_name, shop_id) VALUES ('Salami Passion', 7, 'Ds-SalamiPassion.jpg', 4);