import FAQ from "../models/FAQ.js";
import { cleanString, isValidObjectId } from "../utils/validation.js";

const mapFAQInput = (body) => {
  const rawCategory = body.category;
  const normalizedCategory = rawCategory === 'Returns' ? 'Support' : rawCategory;

  return {
    question: cleanString(body.question, 500),
    answer: cleanString(body.answer, 2000),
    category: normalizedCategory || 'General',
    order: parseInt(body.order) || 0,
    active: body.active !== false,
  };
};

export const getAllFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find({ active: true })
      .sort({ order: 1, createdAt: 1 })
      .lean();

    res.json({
      success: true,
      data: faqs,
    });
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch FAQs",
    });
  }
};

export const getFAQById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid FAQ ID",
      });
    }

    const faq = await FAQ.findById(req.params.id).lean();

    if (!faq) {
      return res.status(404).json({
        success: false,
        error: "FAQ not found",
      });
    }

    res.json({
      success: true,
      data: faq,
    });
  } catch (error) {
    console.error("Error fetching FAQ:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch FAQ",
    });
  }
};

export const createFAQ = async (req, res) => {
  try {
    const faqData = mapFAQInput(req.body);

    if (!faqData.question || !faqData.answer) {
      return res.status(400).json({
        success: false,
        error: "Question and answer are required",
      });
    }

    const faq = new FAQ(faqData);
    await faq.save();

    res.status(201).json({
      success: true,
      data: faq,
    });
  } catch (error) {
    console.error("Error creating FAQ:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create FAQ",
    });
  }
};

export const updateFAQ = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid FAQ ID",
      });
    }

    const faqData = mapFAQInput(req.body);

    const faq = await FAQ.findByIdAndUpdate(
      req.params.id,
      faqData,
      { new: true, runValidators: true }
    );

    if (!faq) {
      return res.status(404).json({
        success: false,
        error: "FAQ not found",
      });
    }

    res.json({
      success: true,
      data: faq,
    });
  } catch (error) {
    console.error("Error updating FAQ:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update FAQ",
    });
  }
};

export const deleteFAQ = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid FAQ ID",
      });
    }

    const faq = await FAQ.findByIdAndDelete(req.params.id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        error: "FAQ not found",
      });
    }

    res.json({
      success: true,
      message: "FAQ deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete FAQ",
    });
  }
};

export const getFAQsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const faqs = await FAQ.find({
      category,
      active: true,
    })
      .sort({ order: 1, createdAt: 1 })
      .lean();

    res.json({
      success: true,
      data: faqs,
    });
  } catch (error) {
    console.error("Error fetching FAQs by category:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch FAQs",
    });
  }
};
