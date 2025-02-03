import { BulkEncryptHandler } from './BulkEncryptHandler'
import { CryptoHandler } from './CryptoHandler'
import './env.config'
import { BulkEncryptRequest, IEncryptData } from './models'
import { Server } from 'socket.io'

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const port = 3000

app.use(cors())

app.use(bodyParser.json())

app.get('/', (req, res) => res.json({ message: 'API is working' }))
app.get('/status', (req, res) => res.json({ message: 'API is working' }))

app.post('/decrypt', (req, res) => {
  try {
    const requestData: IEncryptData = req.body
    const decryptedValue = CryptoHandler.decrypt(requestData)
    res.json({ message: 'Received POST data', data: decryptedValue.toString() })
  } catch (error) {
    console.log('error: ', error.message)
    res.status(500).json({ error: error.message })
  }
})

app.post('/encrypt', (req, res) => {
  try {
    const requestData: IEncryptData = req.body
    const decryptedValue = CryptoHandler.encrypt(requestData)
    res.json({ message: 'Received POST data', data: decryptedValue.toString() })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/one-way-encrypt', (req, res) => {
  try {
    const requestData: string = req.body.data
    CryptoHandler.OneWayEncrypt(requestData)
      .then((val) => res.json({ message: 'Received POST data', data: val.toString() }))
      .catch((error) => res.status(409).json({ error: error.message }))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

const httpServer = app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)

  socket.on('bulk-one-way-encrypt', async (message: BulkEncryptRequest) => {
    await BulkEncryptHandler.handleBulkOneWayEncrypt(socket, message)
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})
