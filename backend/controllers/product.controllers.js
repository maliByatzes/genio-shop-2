import Product from "../models/product.model.js";
import ProductCategory from "../models/product_category.model.js";
import logger from "../utils/logger.js";
import { v2 as cloudinary } from "cloudinary";

export const addProduct = async (req, res) => {
  try {
    const { name, categoryName, description } = req.body;
    let { image, items } = req.body;

    if (!name || !categoryName) {
      return res.status(400).json({ error: "Please provide all required fields" });
    }

    let categoryId;
    if (categoryName) {
      const category = await ProductCategory.findOne({ name: categoryName });
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      categoryId = category._id;
    }

    if (image) {
      const uploadedResponse = await cloudinary.uploader.upload(image);
      image = uploadedResponse.secure_url;
    }

    if (items) {
      for (const item of items) {
        if (!item.sku || !item.quantity || !item.price) {
          return res.status(400).json({ error: "Please provide all required fields" });
        }

        if (item.image) {
          const uploadedResponse = await cloudinary.uploader.upload(item.image);
          item.image = uploadedResponse.secure_url;
        }
      }
    }

    const newProduct = new Product({
      name,
      categoryId,
      description,
      image,
      items,
    });

    if (newProduct) {
      await newProduct.save();
      res.status(201).json(newProduct);
    } else {
      res.status(400).json({ error: "Failed to add product" });
    }
  } catch (error) {
    logger.error(`Error in add product: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("categoryId");
    res.status(200).json(products);
  } catch (error) {
    logger.error(`Error in get all products: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, categoryName, description } = req.body;
    let { image, items } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    let categoryId;
    if (categoryName) {
      const category = await ProductCategory.findOne({ name: categoryName });
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      categoryId = category._id;
    }

    if (image) {
      if (product.image) {
        await cloudinary.uploader.destroy(product.image.split("/").pop().split(".")[0]);
      }
      const uploadedResponse = await cloudinary.uploader.upload(image);
      image = uploadedResponse.secure_url;
    }

    if (items) {
      for (const item of items) {
        if (item.image) {
          await cloudinary.uploader.destroy(item.image.split("/").pop().split(".")[0]);
        }
        const uploadedResponse = await cloudinary.uploader.upload(item.image);
        item.image = uploadedResponse.secure_url;
      }
    }

    product.name = name || product.name;
    product.categoryId = categoryId || product.categoryId;
    product.description = description || product.description;
    product.image = image || product.image;
    product.items = items || product.items;
  } catch (error) {
    logger.error(`Error in update product: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.image) {
      await cloudinary.uploader.destroy(product.image.split("/").pop().split(".")[0]);
    }

    if (product.items) {
      for (const item of product.items) {
        if (item.image) {
          await cloudinary.uploader.destroy(item.image.split("/").pop().split(".")[0]);
        }
      }
    }

    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    logger.error(`Error in delete product: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
};
