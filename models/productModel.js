const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name must be provided'],
  },
  price: {
    type: Number,
    required: [true, 'Price must be provided'],
  },
  featured: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 3,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  company: {
    type: String,
    enum: {
      values: ['ikea', 'liddy', 'caressa', 'marcos'],
      message: '{VALUE} is not suported',
    },
    // enum: ['ikea', 'liddy', 'caressa', 'marcos'],
  },
});

module.exports = mongoose.model('product', productSchema);
