import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { MongoClient, ObjectId } from 'mongodb';
import SSLCommerzPayment from 'sslcommerz-lts';

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

const store_id = process.env.STORE_ID
const store_passwd = process.env.STORE_PWD
const is_live = false //TRUE FOR LIVE, FALSE FOR SANDBOX
const PORT = process.env.PORT;

const client = new MongoClient(process.env.DATABASE_URL);
const run = async () => {
  try {
    const orderCollection = client.db("sslcomerz_payment_gateway").collection("orders");

    app.get("/", async (req, res) => {
      res.send("Server is Running")
    })

    app.post("/payment", async (req, res) => {
      const { userId, name, address, products, subtotal, discount, total } = req.body;
      const tran_id = new ObjectId().toString();

      const data = {
        total_amount: total,
        currency: 'BDT',
        tran_id: tran_id,
        success_url: `${process.env.SUCCESS_DOMAIN}/payment/success/${tran_id}`,// IT PRODUCE POST METHOD
        fail_url: 'http://localhost:3030/fail',
        cancel_url: 'http://localhost:3030/cancel',
        ipn_url: 'http://localhost:3030/ipn',
        shipping_method: 'Courier',
        product_name: 'Computer.',
        product_category: 'Electronic',
        product_profile: 'general',
        cus_name: name,
        cus_email: 'customer@example.com',
        cus_add1: 'Dhaka',
        cus_add2: 'Dhaka',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: '01711111111',
        cus_fax: '01711111111',
        ship_name: name,
        ship_add1: 'Dhaka',
        ship_add2: 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
      };

      const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
      sslcz.init(data).then(apiResponse => {
        let GatewayPageURL = apiResponse.GatewayPageURL
        res.send({ url: GatewayPageURL })
 
        // SENDING GATEWAY PAGE AND INSERTING ORDER DETAILS WITH FALSE PAYMENT STATUS
        orderCollection.insertOne({
          ...req.body,
          paymentStatus:false,
          transId:tran_id
        })

      });

      // PAYMENT SUCCESS ROUTE
      app.post("/payment/success/:transId",async(req,res)=>{
        const {transId}=req.params;
        await orderCollection.updateOne({transId},{$set:{paymentStatus:true}})
        // res.redirect(`${process.env.CLIENT_DOMAIN}/success/${transId}`)
        res.redirect(`${process.env.CLIENT_DOMAIN}/`)
        // AFTER SUCCESSFULL PAYMENT, REDIRECTING TO FRONTEND SUCCESS ROUTE
        
      })

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
