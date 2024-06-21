const emptyCartButton = document.getElementById('emptyCartButton');
const eraseItemButton = document.querySelectorAll('eraseItem');

emptyCartButton.addEventListener('click', async () => {

  const cartId = emptyCartButton.value;
  const response = await fetch(`http://localhost:8080/api/carts/${cartId}`, {
    method: 'DELETE'
  });
  if (response.ok) {
    alert('Cart deleted successfully.');
    location.reload();
  } else {
    alert('Error: Unable to delete the cart.');
  }
});


document.querySelectorAll('.eraseItemButton').forEach(button => {

  button.addEventListener('click', async () => {

    let itemId = button.dataset.itemId;
    let cartId = button.dataset.cartId;

    const response = await fetch(`http://localhost:8080/api/carts/${cartId}/products/${itemId}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      alert('Product deleted successfully.');
      location.reload();
    } else {
      alert('Error: Unable to delete product from the cart.');
    }
  });
});




