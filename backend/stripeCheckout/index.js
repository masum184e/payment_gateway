import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import stripe from 'stripe';
import { MongoClient, ObjectId } from 'mongodb';

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;

const client = new MongoClient(process.env.DATABASE_URL);
const stripeInstance = new stripe(process.env.SECRET_KEY);

const run = async () => {
  try {
    const orderCollection = client.db("stripe_payment_gateway").collection("orders");

    app.get("/", async (req, res) => {
      res.send("Server is Running")
    })

    app.post("/payment", async (req, res) => {
      const { userId, name, address, products, subtotal, discount, total } = req.body;

      const line_items = products.map(product => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: product.quantity,
      }));

      const session = await stripeInstance.checkout.sessions.create({
        payment_method_types: ['card','paypal'],
        line_items,
        mode: 'payment',
        success_url: `${process.env.CLIENT_DOMAIN}`,
        cancel_url: `${process.env.CLIENT_DOMAIN}/cancel`,
      });
      

      res.send({ id: session.id })

    })

    console.log('Database Connection Successfull');
  } catch (err) {
    console.error('Error connecting to MongoDB: ', err);
  }
}

run().catch(console.dir);
app.listen(PORT, () => {
  console.log(`Server Listening at http://localhost:${PORT}`)
})
