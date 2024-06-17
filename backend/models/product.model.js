import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
  items: [
    {
      sku: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
      },
      variations: [
        {
          name: {
            type: String,
          },
          value: {
            type: String,
          },
        },
      ],
    },
  ],
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;
