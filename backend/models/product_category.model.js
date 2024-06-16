import mongoose from "mongoose";

const productCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductCategory",
  },
}, { timestamps: true });

const ProductCategory = mongoose.model('ProductCategory', productCategorySchema);

export default ProductCategory;
