import { CryptoHandler } from "./CryptoHandler";
import './env.config';
import { IEncryptData } from "./models";

const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors')
const port = 1000

app.use(cors())

app.use(bodyParser.json());

app.get('/', (req, res) => res.json({ message: 'API is working' }))
app.get('/status', (req, res) => res.json({ message: 'API is working' }))

app.post('/decrypt', (req, res) => {
  try{
    const requestData: IEncryptData = req.body
    const decryptedValue = CryptoHandler.decrypt(requestData)
    res.json({ message: 'Received POST data', data: decryptedValue.toString() });
  } catch(error) {
    console.log('error: ', error.message)
    res.status(500).json({ error: error.message })
  }
});

app.post('/encrypt', (req, res) => {
  try{
    const requestData: IEncryptData = req.body
    const decryptedValue = CryptoHandler.encrypt(requestData)
    res.json({ message: 'Received POST data', data: decryptedValue.toString() });
  } catch(error) {
    res.status(500).json({ error: error.message })
  }
});

app.post('/one-way-encrypt', (req, res) => {
  try{
    const requestData: string = req.body
    CryptoHandler.OneWayEncrypt(requestData).then((val) => res.json({ message: 'Received POST data', data: val.toString() }))
  } catch(error) {
    res.status(500).json({ error: error.message })
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
