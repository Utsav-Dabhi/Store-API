// we can set up a post route and manually add the data OR
// we can dynamically/automatically add the data using the below method

require('dotenv').config();

const connectDB = require('./db/connect');
const Product = require('./models/productModel');

const jsonProducts = require('./products.json');

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await Product.deleteMany();
    await Product.create(jsonProducts);
    console.log('DB Populated');
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

start();
