const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },

  items: [ 
    {
      productId: {
        type: String,
        required: true,
      },

      quantity: {
        type: Number,
        required: true,
        min: 1, // Ensure the quantity is at least 1
      },

      price: {
        type: Number, // Assuming the price is a number, adjust accordingly if needed
        required: false,
      },

      subtotal: {
        type: Number,
        required: false, //naka false muna para di nya i require
      },
    }
  ],

  total: {
    type: Number,
    required: true,
  },

  orderedOn: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Cart', cartItemSchema);
