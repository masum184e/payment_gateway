import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { MongoClient, ObjectId } from 'mongodb';

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;

const client = new MongoClient(process.env.DATABASE_URL);
const run = async () => {
  try {
    const orderCollection = client.db("stripe_payment_gateway").collection("orders");

    app.get("/", async (req, res) => {
      res.send("Server is Running")
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
