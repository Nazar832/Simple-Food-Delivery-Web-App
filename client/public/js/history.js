async function getOrdersHistory() {
    if (email === '' || phone === '') {
     alert('You have to fill all the fields of the form');
     return;
   } 

   const ordersListElement = document.getElementById('orders');
   ordersListElement.innerHTML = '';

   const inputs = document.querySelectorAll('#orders-history-form input');

   for (const input of inputs) {
     const result = validate(input);
     if (result[0] === false) {
       alert(result[1]);
       return;
     };
   }

    const emailElement = document.getElementById('email');
    const phoneElement = document.getElementById('phone');

   const request = {
     email: emailElement.value, 
     phone: phoneElement.value
   };

   try {     
     const queryParams = new URLSearchParams(request).toString();    
     const url = `/api/history?${queryParams}`;
     const response = await fetch(url);

     if (response.ok) {
       const orders = await response.json();
       if (orders.message) {
         alert(orders.message);
       }
       else {
         for (i = 0; i < orders.length; i++) {
           const order = orders[i];
           const orderItemsContainer = document.createElement('li');
           orderItemsContainer.classList += "order-li"

           for (orderItem of order.orderItems) {             
             orderItemsContainer.innerHTML += `
             <div>
             <img src="/images/${orderItem.image_name}" width="300" height="150" alt="${orderItem.name}">
             <h3>${orderItem.name}</h3>
             <p>Price: ${orderItem.price}$</p>
             <p>Quantity: ${orderItem.quantity}</p>
             </div>`;

             ordersListElement.appendChild(orderItemsContainer);
           }
           orderItemsContainer.innerHTML += `<p>Total price: ${order.totalPrice}$</p>`;
         }
       }       
     } else {
         alert('Error when downloading the orders');
       }
   } catch (error) {
     alert('An error occurred while getting the list of orders.');
   }
 }