require('dotenv').config();

// Rather than developing our own asyncWrapper we are using a package 'express-async-errors'
// async errors
require('express-async-errors');

const express = require('express');
const app = express();

// database connection function
const connectDB = require('./db/connect');
const productsRouter = require('./routes/productsRoute');

// middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorMiddleware = require('./middleware/error-handler');

app.use(express.json());

// routes
app.get('/', (req, res) => {
  res.send(`<h1>Store API</h1><a href="/api/v1/products">products route</a>`);
});

// product routes
app.use('/api/v1/products', productsRouter);

// using middlewares
app.use(notFoundMiddleware);
app.use(errorMiddleware);

// port
const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
