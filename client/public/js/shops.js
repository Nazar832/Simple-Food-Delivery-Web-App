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
    const params = {
      shopName: shopName,
    };
    
    const queryParams = new URLSearchParams(params).toString();
    const url = `/api/foods?${queryParams}`;
    const response = await fetch(url);

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
        <button onclick="addToCart(${foodItem.id}, '${foodItem.name}', ${foodItem.price}, '${foodItem.image_name}', '${shopName.replace("'", "\\'")}')">Add to cart</button>`;
        
        foodsContainer.appendChild(foodItemElement);
    });
  }
  
  function addToCart(itemId, itemName, itemPrice, imageName, shopName) {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    for (const cartItem of cart){
      if (cartItem.id === itemId) {
        alert('This item is already in the cart');
        return;
      } else if (shopName != cartItem.shopName) {
        alert('You can add to cart only the foods from one and the same shop');
        return;
      }
    }

    const cartItem = {id: itemId, name: itemName, shopName: shopName, price: itemPrice, quantity: 1, imageName: imageName};
    cart.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(cart));
  }