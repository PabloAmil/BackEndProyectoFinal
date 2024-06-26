document.addEventListener('DOMContentLoaded', () => {
  const emptyCartButton = document.getElementById('emptyCartButton');
  const eraseItemButtons = document.querySelectorAll('.eraseItemButton');

  console.log(emptyCartButton);
  console.log(eraseItemButtons);

  if (emptyCartButton) {
    emptyCartButton.addEventListener('click', async () => {
      const cartId = emptyCartButton.value;
      const response = await fetch(`${config.serverUrl}/api/carts/${cartId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        alert('Cart deleted successfully.');
        location.reload();
      } else {
        alert('Error: Unable to delete the cart.');
      }
    });
  }

  eraseItemButtons.forEach(button => {
    button.addEventListener('click', async () => {
      let itemId = button.getAttribute('data-item-id');
      let cartId = button.getAttribute('data-cart-id');

      const response = await fetch(`${config.serverUrl}/api/carts/${cartId}/products/${itemId}`, {
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
});
