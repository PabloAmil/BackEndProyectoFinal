

document.addEventListener('DOMContentLoaded', async () => {

  const stripe = Stripe('pk_test_51PQIY8EMK3h745irDOUloEaauYTXC2pfw46N22wcgQDsrZpC1OGpd9VunHdBD20MQ1JvwjXFfkSFCaqKMkz7vmg400mkhC8Vzw');

  const clientSecret = new URLSearchParams(window.location.search).get('clientSecret');
  const elements = stripe.elements();
  const cardElement = elements.create('card');
  cardElement.mount('#payment-form');

  const form = document.createElement('form');
  form.innerHTML = `
    <div id="card-element"></div>
    <button type="submit">Pay</button>
  `;
  
  let element = document.getElementById('payment-form').appendChild(form);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const {error, paymentIntent} = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      }
    });

    if (error) {
      console.error(error);
      window.location.href = '/failure';
    } else {
      window.location.href = '/success';
    }
  });
});