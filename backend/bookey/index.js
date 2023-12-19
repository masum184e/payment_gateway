import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import crypto from 'crypto'
import axios from 'axios'
dotenv.config();

const app = express();
const PORT = process.env.PORT;
app.use(cors());
app.use(express.json());

const generateSHA512Hash = (merchUID, merchTxnUID, successUrl, failureUrl, paymentAmount, paymentMethod, secretKey, randomNumber) => {
    const dataToHash = `${merchUID}|${merchTxnUID}|${successUrl}|${failureUrl}|${paymentAmount}|${paymentMethod}|${secretKey}|${randomNumber}`;
    const sha512Hash = crypto.createHash('sha512').update(dataToHash, 'utf-8').digest('hex');
    return sha512Hash;
}

app.post("/payment", async (req, res) => {
    const MERCH_UID = process.env.MERCH_UID;
    const TRXN_UID = Date.now().toString();
    const SUCCESS_URL = process.env.SUCCESS_URL;
    const FAILURE_URL = process.env.FAILURE_URL;
    const PAYMENT_METHOD = "GEN";
    const SECRET_KEY = process.env.SECRET_KEY;
    const RANDOM_NUMBER = Math.floor(Math.random() * 100)
    const { name, number, total } = req.body
    const PAYMENT_AMOUNT = total;

    const payload = {
        "DBRqst": "PY_ECom",
        "Do_Appinfo": {
            "AppTyp": "WEB",
            "IPAddrs": "",
            "Country": "",
            "AppVer": "1.0",
            "ApiVer": "1.0",
            "APPID": "",
            "MdlID": "",
            "DevcType": "",
            "HsCode": "",
            "OS": "",
            "UsrSessID": ""
        },
        "Do_MerchDtl": {
            "BKY_PRDENUM": "ECom",
            "FURL": FAILURE_URL,
            "MerchUID": MERCH_UID,
            "SURL": SUCCESS_URL
        },
        "Do_PyrDtl": {
            "Pyr_MPhone": number,
            "Pyr_Name": name
        },
        "Do_TxnDtl": [
            {
                "SubMerchUID": MERCH_UID,
                "Txn_AMT": total.toString(),
                "DBRqst": "PY_ECom"
            }
        ],
        "Do_TxnHdr": {
            "Merch_Txn_UID": TRXN_UID,
            "PayFor": "ECom",
            "PayMethod": "KNET",
            "Txn_HDR": RANDOM_NUMBER,
            "BKY_Txn_UID": "",
            "hashMac": generateSHA512Hash(MERCH_UID, TRXN_UID, SUCCESS_URL, FAILURE_URL, PAYMENT_AMOUNT, PAYMENT_METHOD, SECRET_KEY, RANDOM_NUMBER)
        }
    };

    try {
        const response = await axios.post('https://pg.bookeey.com/internalapi/api/payment/requestLink', payload, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const responseBody = response.data;
        if (responseBody.ErrorMessage === 'Success') {
            console.log('Payment URL:', responseBody.PayUrl);
            console.log('Payment gateway:', responseBody.PaymentGateway);
            res.send(responseBody);
        } else {
            console.log('Failed to pay');
            res.status(500).send({ message: 'Failed to pay' });
        }

    } catch (error) {
        console.error('Error making request:', error);
        res.status(500).send({ message: 'Failed to pay' });
    }

})

app.listen(PORT, () => { console.log(`Server Listening at http://localhost:${PORT}`) });