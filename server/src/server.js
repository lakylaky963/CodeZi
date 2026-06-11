import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import mongoConnect from 'config/db'
import rootRouter from 'routes'

const app = express()
const port = process.env.PORT || 8080

const allowedOrigins = [process.env.CLIENT_URL, 'http://localhost:5173'].filter(Boolean)
const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      // Allow non-browser clients like server-side requests or Postman
      return callback(null, true)
    }
    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    }
    callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
  optionsSuccessStatus: 200,
}

// Middlewares
app.use(cors(corsOptions))
app.options('*', cors(corsOptions))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

// set up api route
app.use('/api', rootRouter)

// Error handler that preserves CORS headers for thrown errors
app.use((err, req, res, next) => {
  if (!res.headersSent) {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins[0] || '*')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    )
  }

  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: err.message })
  }

  console.error(err)
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  })
})

mongoConnect().then(async () => {
  app.listen(port, () => {
    console.log(`node env: ${process.env.NODE_ENV}`)
    console.log(`server listening on port ${port}`)
  })
})
