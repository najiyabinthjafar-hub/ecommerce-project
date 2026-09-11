const Category = require("../models/Category");

const getAllCategories = async () => {
  return await Category.find();
};


const getCategoryTree = async () => {
  const categories = await Category.find({ status: "active" });

  const parentCategories = categories.filter(
    (category) => category.parent === null
  );

  const categoryTree = parentCategories.map((parent) => {
    const children = categories.filter(
      (category) =>
        category.parent &&
        category.parent.toString() === parent._id.toString()
    );

    return {
      ...parent.toObject(),
      children,
    };
  });

  return categoryTree;
};


const createCategory = async (categoryData) => {
  return await Category.create(categoryData);
};




const getCategoryById = async (id) => {
  return await Category.findById(id);
};

const updateCategory = async (id, categoryData) => {
  return await Category.findByIdAndUpdate(
    id,
    categoryData,
    { new: true, runValidators: true }
  );
};

const deleteCategory = async (id) => {
  return await Category.findByIdAndDelete(id);
};

const getActiveCategories = async () => {
  return await Category.find({
    status: "active",
  });
};


module.exports = {
  getAllCategories,
  createCategory,
  getActiveCategories,
  getCategoryTree,
  getCategoryById,
  updateCategory,
  deleteCategory,
};