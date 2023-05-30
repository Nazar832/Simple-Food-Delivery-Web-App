const Router = require('express');
const db = require('../data/database.js')

const router = new Router();

router.post('/order', async (req, res) => {
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
        const userValues = [name, email, phone, address];
        const userResult = await db.query('INSERT INTO "User"(name, email, phone, address) VALUES ($1, $2, $3, $4) RETURNING id', userValues);
        userId = userResult.rows[0].id;     
      }
  
      const orderIdQuery = await db.query('INSERT INTO "Order"(user_id) VALUES ($1) RETURNING id', [userId]);
      const orderId = orderIdQuery.rows[0].id;

      for (const item of orderItems) {
        const orderItemsValues = [item.quantity, item.food_item_id, orderId];
        const orderItemQuery = await db.query('INSERT INTO OrderItem(quantity, food_item_id, order_id) VALUES ($1, $2, $3) RETURNING id', orderItemsValues);
      }

      res.sendStatus(200);
    } catch (error) {
      console.error('Error submitting the order', error);
      res.sendStatus(500);
    }
  });

  module.exports = router;
