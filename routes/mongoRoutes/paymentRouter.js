import { Router, query } from "express";
import passport from "passport";
import checkPermissions from "../../utils/auth.middleware.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);
const router = Router();

router.get("/checkout", (req, res) => {
  res.render('purchase', {
    style: 'stripe.css',
  })
})

router.post('/create-payment-intent', async (req, res) => { 

  const amount = req.body.ticket.amount;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 5000000, // quitar el hardcodeo luego
    currency: 'usd',
    metadata: {
      email: req.body.userData.email,
      userId: req.body.userData._id,
      ticketCode: req.body.ticket.code
    }
  });

  if (!paymentIntent) {
    return res.status(500).send('Failed to create paument intent');
  }

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});


export default router;