const express = require('express');
require('dotenv').config({path:__dirname+'/.env'});
const path = require('path')

const shopRouter = require('./routes/shop.routes');
const cartRouter = require('./routes/cart.routes');
const historyRouter = require('./routes/history.routes');

const port = parseInt(process.env.WS_PORT);

const app = express()

app.listen(port, () => console.log('Server has started successfully on port', port))

app.use(express.json())
app.use(express.static(path.join(__dirname, '../client/public')));

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

app.use('/api', shopRouter);
app.use('/api', cartRouter);
app.use('/api', historyRouter);
