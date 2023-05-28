let items = [];

async function displayShops() {
    const response = await fetch('/api/shops');
    if (response.status === 500) {
      alert('Error when downloading the list of shops');
      return;
    }
    const shops = await response.json();
  
    const shopsContainer = document.getElementById('shops');
    shops.forEach((shop) => {
      const shopElement = document.createElement('li');
      shopElement.innerHTML = `
        <button onclick="displayFoodItems('${shop.name.replace("'", "\\'")}')">${shop.name}</button>`;
      shopsContainer.appendChild(shopElement);
    });
  }

  async function displayFoodItems(shopName) {
    const response = await fetch('/api/foods', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({shopname: shopName})
    });

    if (response.status === 500) {
      alert('Error when downloading the list of foods');
      return;
    }

    const foodItems = await response.json();
    const foodsContainer = document.getElementById('food-items');
    foodsContainer.innerHTML = '';
    foodItems.forEach((foodItem) => {
      const foodItemElement = document.createElement('li');
      foodItemElement.innerHTML = `
        <img src="/images/${foodItem.image_name}" width="300" height="150" alt="${foodItem.name}">
        <h3>${foodItem.name}</h3>
        <button onclick="addToCart(${foodItem.id})">Add to cart</button>`;
        foodsContainer.appendChild(foodItemElement);
    });

  }
  
  function addToCart(itemId) {
    if (localStorage.getItem('items').includes(itemId)){
      alert('This item is already in the cart');
      return;
    }
    items.push(itemId);
    localStorage.setItem('items', JSON.stringify(items));
  }

  async function getOrdersHistory() {
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    if (email === '' || phone === '') {
      alert('You have to fill all the fields of the form');
      return;
  }

    const request = {
      email: email, 
      phone: phone
    };

    try {
      const response = await fetch('/api/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      if (response.ok) {
        const orders = await response.json();
        if (orders.message) {
          alert(orders.message);
        }
        else {
          const listElement = document.getElementById('orders');
          
          for (i = 0; i < orders.length; i++) {
            const order = orders[i];
            const orderItemsContainer = document.createElement('li');
            for (orderItem of order) {             
              orderItemsContainer.innerHTML += `
              <div>
              <img src="/images/${orderItem.image_name}" width="300" height="150" alt="${orderItem.name}">
              <h3>${orderItem.name}</h3>
              <p>Price: ${orderItem.price}$</p>
              <p>Quantity: ${orderItem.quantity}</p>
              </div>`;
              listElement.appendChild(orderItemsContainer);
            }           
          }
        }       
      }
      else {
        alert('Error when downloading the orders');
      }

    } catch (error) {
      console.error('Error submitting order', error);
      alert('An error occurred while submitting the order.');
    }
  }
  
  if (window.location.href === 'http://localhost:8090/' || window.location.href === 'http://localhost:8090/shops.html'){
    displayShops();
  }