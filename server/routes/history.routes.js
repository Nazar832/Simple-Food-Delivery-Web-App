const Router = require('express');
const db = require('../data/database.js')

const router = new Router();

router.get('/history', async (req, res) => {
    try {
      const {email, phone} = req.query;
    
      const user = await db.query('SELECT id FROM "User" WHERE email = ($1) AND phone = ($2)', [email, phone]);
      if (user.rowCount === 0) {
        res.json({message: 'No orders by this user.'});
        return;
      }

      const orders = await db.query('SELECT id FROM "Order" WHERE user_id = ($1)', [user.rows[0].id]);
      const response = [];
      for (order of orders.rows) {
        const orderItems = await db.query('SELECT FoodItem.name, FoodItem.price, FoodItem.image_name, OrderItem.quantity FROM OrderItem INNER JOIN '+ 
        'FoodItem ON OrderItem.food_item_id = FoodItem.id AND OrderItem.order_id = ($1)', [order.id]);

        const result = await db.query('SELECT * FROM OrderItem');      

        const orderItemsArr = [];

        let totalPrice = 0;
        for (orderItem of orderItems.rows) {         
          totalPrice += orderItem.price * orderItem.quantity;

          orderItemsArr.push({
            name: orderItem.name,
            price: orderItem.price,
            image_name: orderItem.image_name,
            quantity: orderItem.quantity,
          })
        } 
        response.push({
          orderItems: orderItemsArr, 
          totalPrice: totalPrice
        });
      }
    res.json(response);
  } catch (error) {
    console.error('Error getting the list of orders', error);
    res.sendStatus(500);
  }
});

module.exports = router;