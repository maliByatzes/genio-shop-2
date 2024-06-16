import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  unitNumber: {
    type: String,
  },
  street: {
    type: String,
    required: true,
  },
  addressLine1: {
    type: String,
    required: true,
  },
  addressLine2: {
    type: String,
  },
  postalCode: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Address = mongoose.model('Address', addressSchema);

export default Address;
