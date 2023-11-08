import { CryptoHandler } from "./CryptoHandler";
import './env.config'

const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors')
const port = 1000

app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello, Express!')
})

// Middleware to parse JSON request body
app.use(bodyParser.json());

// Define a route to handle POST requests
app.post('/decrypt', (req, res) => {
  // Access the JSON data from the request body
  const requestData: string = req.body.data
  console.log(requestData)

  const decryptedValue = CryptoHandler.decrypt(requestData)

  res.json({ message: 'Received POST data', data: decryptedValue.toString() });

});

app.post('/encrypt', (req, res) => {
  // Access the JSON data from the request body
  const requestData: string = req.body.data
  console.log(requestData)

  const decryptedValue = CryptoHandler.encrypt(requestData)

  res.json({ message: 'Received POST data', data: decryptedValue.toString() });

});

app.post('/one-way-encrypt', (req, res) => {
  // Access the JSON data from the request body
  const requestData: string = req.body.data
  console.log(requestData)

  CryptoHandler.OneWayEncrypt(requestData).then((val) => {
    res.json({ message: 'Received POST data', data: val.toString() });
  })


});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
