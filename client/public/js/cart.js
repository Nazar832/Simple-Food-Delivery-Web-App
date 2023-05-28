async function displayCart() {
    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({items: JSON.parse(localStorage.getItem('items'))})
    });

    if (response.status === 500) {
      alert('Error when downloading the cart');
      return;
    }

    const orderItems = await response.json();
    const orderItemsContainer = document.getElementById('order-items');
    
    let totalPrice = 0;
    for (i = 0; i < orderItems.length; i++) {
      orderItem = orderItems[i];
      const orderItemElement = document.createElement('li');
      orderItemElement.innerHTML = `
        <img src="/images/${orderItem.image_name}" width="300" height="150" alt="${orderItem.name}">
        <h3>${orderItem.name}</h3>
        <p>Price: ${orderItem.price}$</p>
        <input class="numberOffoodItems" onfocus="this.oldvalue = this.value;" onchange="calcTotalPrice(this, ${orderItem.price});this.oldvalue = this.value;" type="number" min="1" max="100" value="1">
        <button onclick="removeFromCart(${orderItem.id})">Remove</button>`;
        orderItemsContainer.appendChild(orderItemElement);
        totalPrice += orderItem.price;
    }
    
    const spanElement = document.getElementById('total-price');
    spanElement.textContent = totalPrice;
  }

  function calcTotalPrice(price)
  {
    const spanElement = document.getElementById('total-price');
    totalPrice = +spanElement.textContent;

    if (this.oldvalue < this.value) {
        totalPrice += price;
    }
    else{
        totalPrice -= price;
    }
    
    spanElement.textContent = totalPrice.toString(); 
  }

  function removeFromCart(itemId) {
    const items = JSON.parse(localStorage.getItem('items'));
    const position = items.indexOf(itemId);
    const listOfItems = document.querySelectorAll('#order-items li');
    listOfItems[position].remove();
    items.splice(position, 1);
    localStorage.setItem('items', JSON.stringify(items));
  }
  
async function submitOrder() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;

    if (name === '' || email === '' || phone === '' || address === '') {
        alert('You have to fill all the fields of the form');
        return;
    }

    const items = JSON.parse(localStorage.getItem('items'));
  
    const orderItemsContainer = document.querySelectorAll('#order-items input');
    const orderItems = [];
    for (i = 0; i < orderItemsContainer.length; i++)
    {
      quantity = parseInt(orderItemsContainer[i].value);
      food_item_id = items[i];
      orderItem = {
        quantity: quantity, 
        food_item_id: food_item_id
      };
      orderItems.push(orderItem);
    }
    
    const order = {
      name: name,
      email: email,
      phone: phone,
      address: address,
      orderItems: orderItems, 
    };
  
    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });
  
        localStorage.removeItem('items');
        alert('Order submitted successfully!');

        if (response.status === 400){
        alert('Invalid name of address for the user with such email and phone.');
      }
    } catch (error) {
      console.error('Error submitting order', error);
      alert('An error occurred while submitting the order.');
    }
  }