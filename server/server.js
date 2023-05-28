const express = require('express');
require('dotenv').config({path:__dirname+'/.env'});
const path = require('path')
const db = require('./data/database.js')

console.log(__dirname);
const port = parseInt(process.env.WS_PORT);

const app = express()

app.listen(port, () => console.log('Server has started successfully on port', port))

app.use(express.json())
app.use(express.static(path.join(__dirname, '../client/public')))

app.get('/', function (req, res) {
    res.redirect('/shops.html');
})

app.get('/shops.html', function (req, res) {
  res.sendFile('shops.html', {root: path.join(__dirname, '../client/views')});
})
app.get('/cart.html', function (req, res) {
  res.sendFile('cart.html', {root: path.join(__dirname, '../client/views')})
})

app.get('/history.html', function (req, res) {
  res.sendFile('history.html', {root: path.join(__dirname, '../client/views')})
})

app.get('/api/shops', async (req, res) => {
    try {
      const result = await db.query('SELECT * FROM Shop');
      const shops = result.rows;
      res.json(shops);
    } catch (error) {
      console.error('Error executing query', error);
      res.sendStatus(500);
    }
  });

app.post('/api/foods', async (req, res) => {
    try {
      const shopName = req.body.shopname;
      const shopId = await db.query('SELECT id FROM Shop WHERE name = ($1)', [shopName]);
      const result = await db.query('SELECT * FROM FoodItem WHERE FoodItem.shop_id = ($1)', [shopId.rows[0].id]);

      const foodItems = result.rows;
      res.json(foodItems);
    } catch (error) {
      console.error('Error executing query', error);
      res.sendStatus(500);
    }
  });

  app.post('/api/cart', async (req, res) => {
    try {
      const foodItemsId = req.body.items;

      const foodItems = [];
      for (id of foodItemsId) {
        const foodItem = await db.query('SELECT * FROM FoodItem WHERE id = ($1)', [id]);
        foodItems.push(foodItem.rows[0]);
      }
      
      res.json(foodItems);
    } catch (error) {
      console.error('Error executing query', error);
      res.sendStatus(500);
    }
  });
  
app.post('/api/order', async (req, res) => {
    const { name, email, phone, address, orderItems } = req.body;
  
    try {
      // Create a new user if doesn't exist
      let userId;
      let userAlreadyExists = false;
      const users = await db.query('SELECT * FROM "User"');
    
      for (const user of users.rows) {
        if (user.email === email && user.phone === phone) {
          if (user.name !== name || user.address !== address) {
            res.sendStatus(400);
            return;
          } else {
            userAlreadyExists = true;
            userId = user.id;
            break;
          }
      }
    }

      if (userAlreadyExists === false) {
        const userQuery = 'INSERT INTO "User"(name, email, phone, address) VALUES ($1, $2, $3, $4) RETURNING id';
        const userValues = [name, email, phone, address];
        const userResult = await db.query(userQuery, userValues);
        userId = userResult.rows[0].id;     
      }
  
      const orderIdQuery = await db.query('INSERT INTO "Order"(user_id) VALUES ($1) RETURNING id', [userId]);
      const orderId = orderIdQuery.rows[0].id;

      const orderItemsQuery = 'INSERT INTO OrderItem(quantity, food_item_id, order_id) VALUES ($1, $2, $3)';
      for (const item of orderItems) {
        const orderItemsValues = [item.quantity, item.food_item_id, orderId];
        await db.query(orderItemsQuery, orderItemsValues);
      }
    } catch (error) {
      console.error('Error executing query', error);
      res.sendStatus(500);
    }
  });

  app.post('/api/history', async (req, res) => {
    try {
      const {email, phone} = req.body;
      const user = await db.query('SELECT id FROM "User" WHERE email = ($1) AND phone = ($2)', [email, phone]);
      if (user.rowCount === 0) {
        res.json({message: 'No orders by this user.'});
        return;
      }

      const orders = await db.query('SELECT id FROM "Order" WHERE user_id = ($1)', [user.rows[0].id]);
      const response = [];
      for (order of orders.rows) {
        const orderItems = await db.query('SELECT * FROM OrderItem WHERE order_id = ($1)', [order.id]);
        const arr = [];
        for (orderItem of orderItems.rows) {
          const foodItem = await db.query('SELECT * FROM FoodItem WHERE id = ($1)', [orderItem.food_item_id]);

          arr.push({
            name: foodItem.rows[0].name,
            price: foodItem.rows[0].price,
            image_name: foodItem.rows[0].image_name,
            quantity: orderItem.quantity
          })
        } 
        response.push(arr);
    }
    console.log(response.length);
    res.json(response);
  } catch (error) {
    console.error('Error executing query', error);
    res.sendStatus(500);
  }
});