import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  addresses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    }
  ],
  stripeCustomerId: {
    type: String,
  },
  cart: {
    items: [
      {
        productItemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product.items",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
