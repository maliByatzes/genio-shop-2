import ProductCategory from "../models/product_category.model.js";
import logger from "../utils/logger.js";

export const addProductCategory = async (req, res) => {
  try {
    const { name, parentCategory } = req.body;

    let parentId;
    if (parentCategory) {
      const parent = await ProductCategory.findOne({ name: parentCategory });
      if (!parent) {
        return res.status(404).json({ error: "Parent category not found" });
      }
      parentId = parent._id;
    }

    const productCategory = new ProductCategory({
      name,
      parentId,
    });

    if (productCategory) {
      await productCategory.save();
      res.status(201).json(productCategory);
    } else {
      res.status(400).json({ error: "Failed to add product category" });
    }
  } catch (error) {
    logger.error(`Error in add product category: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllProductCategories = async (req, res) => {
  try {
    const productCategories = await ProductCategory.find().populate("parentId");
    res.status(200).json(productCategories);
  } catch (error) {
    logger.error(`Error in get all product categories: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateProductCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, parentCategory } = req.body;

    const productCategory = await ProductCategory.findById(id);
    if (!productCategory) {
      return res.status(404).json({ error: "Product category not found" });
    }

    let parentId;
    if (parentCategory) {
      const parent = await ProductCategory.findOne({ name: parentCategory });
      if (!parent) {
        return res.status(404).json({ error: "Parent category not found" });
      }
      parentId = parent._id;
    }

    productCategory.name = name || productCategory.name;
    productCategory.parentId = parentId || productCategory.parentId;

    await productCategory.save();
    res.status(200).json(productCategory);
  } catch (error) {
    logger.error(`Error in update product category: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteProductCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const productCategory = await ProductCategory.findByIdAndDelete(id);
    if (!productCategory) {
      return res.status(404).json({ error: "Product category not found" });
    }
    res.status(200).json({ message: "Product category deleted successfully" });
  } catch (error) {
    logger.error(`Error in delete product category: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
};
