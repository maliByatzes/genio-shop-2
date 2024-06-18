import ProductCategory from "../models/product_category.model.js";
import Promotion from "../models/promotion.model.js";
import logger from "../utils/logger.js";

export const addPromotion = async (req, res) => {
  try {
    const { name, description, discountRate, startDate, endDate } = req.body;

    if (!name || !description || !discountRate || !startDate || !endDate) {
      return res.status(400).json({ error: "Please provide all required fields" });
    }

    const newPromotion = new Promotion({
      name,
      description,
      discountRate,
      startDate,
      endDate,
    });

    if (newPromotion) {
      await newPromotion.save();
      res.status(201).json(newPromotion);
    } else {
      res.status(400).json({ error: "Failed to add promotion" });
    }
  } catch (error) {
    logger.error(`Error in add promotion: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addCategoryToPromotion = async (req, res) => {
  try {
    const { id: promotionId } = req.params;
    const { categoryId } = req.body;

    const promotion = await Promotion.findById(promotionId);
    if (!promotion) {
      return res.status(404).json({ error: "Promotion not found" });
    }

    const category = await ProductCategory.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    promotion.categories.push(categoryId);
    await promotion.save();
    res.status(200).json({ message: "Category added to promotion successfully" });
  } catch (error) {
    logger.error(`Error in add category to promotion: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const removeCategoryFromPomotion = async (req, res) => {
  try {
    const { id: promotionId } = req.params;
    const { categoryId } = req.body;

    const promotion = await Promotion.findById(promotionId);
    if (!promotion) {
      return res.status(404).json({ error: "Promotion not found" });
    }

    const categoryExists = promotion.categories.includes(categoryId);
    if (!categoryExists) {
      return res.status(404).json({ error: "Category not found in promotion" });
    }

    promotion.categories = promotion.categories.filter((category) => category.toString() !== categoryId);

    await promotion.save();
    res.status(200).json({ message: "Category removed from promotion successfully" });
  } catch (error) {
    logger.error(`Error in remove category from promotion: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getActivePromotions = async (req, res) => {
  try {
    const currentDate = new Date();

    const activePromotions = await Promotion.find({
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate },
    });

    res.status(200).json(activePromotions);
  } catch (error) {
    logger.error(`Error in get active promotions: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updatePromotion = async (req, res) => {
  try {
    const { id: promotionId } = req.params;
    const { name, description, discountRate, startDate, endDate } = req.body;

    const promotion = await Promotion.findById(promotionId);
    if (!promotion) {
      return res.status(404).json({ error: "Promotion not found" });
    }

    promotion.name = name || promotion.name;
    promotion.description = description || promotion.description;
    promotion.discountRate = discountRate || promotion.discountRate;
    promotion.startDate = startDate || promotion.startDate;
    promotion.endDate = endDate || promotion.endDate;

    await promotion.save();
    res.status(200).json({ message: "Promotion updated successfully" });
  } catch (error) {
    logger.error(`Error in update promotion: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deletePromotion = async (req, res) => {
  try {
    const { id: promotionId } = req.params;

    const promotion = await Promotion.findById(promotionId);

    if (!promotion) {
      return res.status(404).json({ error: "Promotion is not found" });
    }

    await Promotion.findByIdAndDelete(promotionId);
    res.status(200).json({ message: "Promotion deleted successfully" });
  } catch (error) {
    logger.error(`Error in delete promotion: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
};
