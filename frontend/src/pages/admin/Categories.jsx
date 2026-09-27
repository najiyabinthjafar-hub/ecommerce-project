import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Categories.css";

const API_URL = "http://localhost:5000/api/categories";

function Categories() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // main / sub
  const [categoryMode, setCategoryMode] = useState("main");

  const [formData, setFormData] = useState({
    name: "",
    parent: "",
  });

  // =========================
  // FETCH CATEGORIES
  // =========================
  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();

      setCategories(data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      alert("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // =========================
  // GENERATE SLUG
  // =========================
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  // =========================
  // ADD MAIN CATEGORY
  // =========================
  const handleAddMain = () => {
    setEditingCategory(null);
    setCategoryMode("main");

    setFormData({
      name: "",
      parent: "",
    });

    setShowModal(true);
  };

  // =========================
  // ADD SUBCATEGORY
  // =========================
  const handleAddSub = () => {
    setEditingCategory(null);
    setCategoryMode("sub");

    setFormData({
      name: "",
      parent: "",
    });

    setShowModal(true);
  };

  // =========================
  // EDIT CATEGORY
  // =========================
  const handleEdit = (category) => {
    setEditingCategory(category);

    // If parent exists => subcategory
    // Otherwise => main category
    setCategoryMode(category.parent ? "sub" : "main");

    setFormData({
      name: category.name || "",
      parent: category.parent?._id || category.parent || "",
    });

    setShowModal(true);
  };

  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // SUBMIT CATEGORY
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const categoryName = formData.name.trim();

    if (!categoryName) {
      alert("Please enter category name");
      return;
    }

    // Subcategory must have a parent
    if (categoryMode === "sub" && !formData.parent) {
      alert("Please select a parent category");
      return;
    }

    const slug = generateSlug(categoryName);

    try {
      // Main category => parent null
      // Subcategory => selected parent id
      const payload = {
        name: categoryName,
        slug: slug,
        parent: categoryMode === "main" ? null : formData.parent,
      };

      // =========================
      // UPDATE
      // =========================
      if (editingCategory) {
        const response = await fetch(
          `${API_URL}/${editingCategory._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to update category");
        }

        alert("Category updated successfully!");
      }

      // =========================
      // ADD
      // =========================
      else {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to add category");
        }

        if (categoryMode === "main") {
          alert("Main category added successfully!");
        } else {
          alert("Subcategory added successfully!");
        }
      }

      setShowModal(false);
      setEditingCategory(null);

      setFormData({
        name: "",
        parent: "",
      });

      fetchCategories();
    } catch (error) {
      console.error("Category error:", error);
      alert(error.message || "Something went wrong");
    }
  };

  // =========================
  // DELETE CATEGORY
  // =========================
  const handleDelete = async (categoryId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/${categoryId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete category");
      }

      alert("Category deleted successfully!");

      fetchCategories();
    } catch (error) {
      console.error("Delete error:", error);
      alert(error.message || "Failed to delete category");
    }
  };

  // =========================
  // CLOSE MODAL
  // =========================
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);

    setFormData({
      name: "",
      parent: "",
    });
  };

  // =========================
  // GET PARENT NAME
  // =========================
  const getParentName = (category) => {
    if (!category.parent) {
      return null;
    }

    if (typeof category.parent === "object") {
      return category.parent.name;
    }

    const parentCategory = categories.find(
      (item) => item._id === category.parent
    );

    return parentCategory?.name || "Unknown";
  };

  // =========================
  // MAIN CATEGORIES
  // =========================
  const parentCategories = categories.filter(
    (category) => !category.parent
  );

  // =========================
  // SEARCH
  // =========================
  const filteredCategories = categories.filter((category) =>
    category.name?.toLowerCase().includes(search.toLowerCase())
  );

  // =========================
  // STATS
  // =========================
  const totalCategories = categories.length;

  const mainCategories = categories.filter(
    (category) => !category.parent
  ).length;

  const subCategories = categories.filter(
    (category) => category.parent
  ).length;

  return (
    <div className="categories-page">
      {/* =========================
          PAGE HEADER
      ========================= */}
      <div className="category-page-header">
        <div>
          <span className="category-eyebrow">
            PRODUCT MANAGEMENT
          </span>

          <h1>Categories</h1>

          <p>
            Organize products with main categories and subcategories.
          </p>
        </div>

        <div className="category-header-actions">
          <button
            className="add-category-btn"
            onClick={handleAddMain}
          >
            <i className="bi bi-plus-lg"></i>
            Main Category
          </button>

          <button
            className="add-subcategory-btn"
            onClick={handleAddSub}
          >
            <i className="bi bi-diagram-3"></i>
            Subcategory
          </button>
        </div>
      </div>

      {/* =========================
          STATS
      ========================= */}
      <div className="category-stats">
        <div className="category-stat-card">
          <div className="category-stat-icon">
            <i className="bi bi-grid"></i>
          </div>

          <div>
            <span>Total Categories</span>
            <strong>{totalCategories}</strong>
          </div>
        </div>

        <div className="category-stat-card">
          <div className="category-stat-icon">
            <i className="bi bi-folder"></i>
          </div>

          <div>
            <span>Main Categories</span>
            <strong>{mainCategories}</strong>
          </div>
        </div>

        <div className="category-stat-card">
          <div className="category-stat-icon">
            <i className="bi bi-diagram-3"></i>
          </div>

          <div>
            <span>Subcategories</span>
            <strong>{subCategories}</strong>
          </div>
        </div>
      </div>

      {/* =========================
          MAIN CATEGORY TABLE CARD
      ========================= */}
      <div className="categories-card">
        <div className="categories-card-header">
          <div>
            <h2>All Categories</h2>

            <p>
              Manage your product categories and subcategories.
            </p>
          </div>

          <div className="category-search">
            <i className="bi bi-search"></i>

            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* =========================
            TABLE
        ========================= */}
        <div className="categories-table-wrapper">
          {loading ? (
            <div className="category-loading">
              <i className="bi bi-arrow-repeat"></i>
              <span>Loading categories...</span>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="category-empty">
              <i className="bi bi-folder2-open"></i>

              <h3>No categories found</h3>

              <p>
                Add a main category or subcategory to get started.
              </p>
            </div>
          ) : (
            <table className="categories-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Products</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredCategories.map((category, index) => {
                  const parentName = getParentName(category);
                  const isSubcategory = !!category.parent;

                  return (
                    <tr key={category._id}>
                      {/* NUMBER */}
                      <td className="category-number">
                        {index + 1}
                      </td>

                      {/* CATEGORY */}
                      <td>
                        <div className="category-info">
                          <div className="category-icon">
                            {category.name
                              ?.charAt(0)
                              ?.toUpperCase()}
                          </div>

                          <div>
                            <strong>{category.name}</strong>

                            <span>
                              {category.slug ||
                                generateSlug(category.name)}
                            </span>

                            {parentName && (
                              <small>
                                Subcategory of {parentName}
                              </small>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* TYPE */}
                      <td>
                        {isSubcategory ? (
                          <span className="category-type subcategory-type">
                            Subcategory
                          </span>
                        ) : (
                          <span className="category-type main-category-type">
                            Main Category
                          </span>
                        )}
                      </td>

                      {/* PRODUCTS */}
                      <td>
                        <span className="product-count">
                          {category.productCount ||
                            category.productsCount ||
                            category.products?.length ||
                            0}
                        </span>
                      </td>

                      {/* STATUS */}
                      <td>
                        {category.status === "inactive" ? (
                          <span className="category-status inactive">
                            Inactive
                          </span>
                        ) : (
                          <span className="category-status active">
                            Active
                          </span>
                        )}
                      </td>

                      {/* ACTIONS */}
                      <td>
                        <div className="category-actions">
                          <button
                            className="category-edit-btn"
                            onClick={() => handleEdit(category)}
                            title="Edit"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>

                          <button
                            className="category-delete-btn"
                            onClick={() =>
                              handleDelete(category._id)
                            }
                            title="Delete"
                          >
                            <i className="bi bi-trash3"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* =========================
          ADD / EDIT MODAL
      ========================= */}
      {showModal && (
        <div
          className="category-modal-overlay"
          onClick={handleCloseModal}
        >
          <div
            className="category-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="category-modal-header">
              <div>
                <span className="modal-eyebrow">
                  {editingCategory
                    ? "CATEGORY MANAGEMENT"
                    : categoryMode === "main"
                    ? "MAIN CATEGORY"
                    : "SUBCATEGORY"}
                </span>

                <h2>
                  {editingCategory
                    ? "Edit Category"
                    : categoryMode === "main"
                    ? "Add Main Category"
                    : "Add Subcategory"}
                </h2>

                <p>
                  {editingCategory
                    ? "Update category information."
                    : categoryMode === "main"
                    ? "Create a new main product category."
                    : "Create a subcategory under a main category."}
                </p>
              </div>

              <button
                className="modal-close-btn"
                onClick={handleCloseModal}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit}>
              {/* CATEGORY NAME */}
              <div className="category-form-group">
                <label>
                  Category Name
                  <span>*</span>
                </label>

                <div className="category-input-wrapper">
                  <i className="bi bi-folder"></i>

                  <input
                    type="text"
                    name="name"
                    placeholder={
                      categoryMode === "main"
                        ? "e.g. Women's Fashion"
                        : "e.g. T-Shirts"
                    }
                    value={formData.name}
                    onChange={handleChange}
                    autoFocus
                  />
                </div>
              </div>

              {/* PARENT CATEGORY */}
              {categoryMode === "sub" && (
                <div className="category-form-group">
                  <label>
                    Parent Category
                    <span>*</span>
                  </label>

                  <div className="category-input-wrapper">
                    <i className="bi bi-diagram-3"></i>

                    <select
                      name="parent"
                      value={formData.parent}
                      onChange={handleChange}
                    >
                      <option value="">
                        Select Parent Category
                      </option>

                      {parentCategories
                        .filter(
                          (category) =>
                            category._id !== editingCategory?._id
                        )
                        .map((category) => (
                          <option
                            key={category._id}
                            value={category._id}
                          >
                            {category.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              )}

              {/* PREVIEW */}
              <div className="category-preview">
                <div className="preview-icon">
                  {formData.name
                    ? formData.name.charAt(0).toUpperCase()
                    : "C"}
                </div>

                <div className="preview-content">
                  <strong>
                    {formData.name || "Category Name"}
                  </strong>

                  <span>
                    {formData.name
                      ? generateSlug(formData.name)
                      : "category-slug"}
                  </span>

                  {categoryMode === "sub" && formData.parent && (
                    <small>
                      <i className="bi bi-arrow-return-right"></i>

                      Subcategory of{" "}
                      {
                        parentCategories.find(
                          (category) =>
                            category._id === formData.parent
                        )?.name
                      }
                    </small>
                  )}

                  {categoryMode === "main" && (
                    <small>
                      <i className="bi bi-folder"></i>
                      Main Category
                    </small>
                  )}
                </div>
              </div>

              {/* MODAL ACTIONS */}
              <div className="category-modal-actions">
                <button
                  type="button"
                  className="category-cancel-btn"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="category-submit-btn"
                >
                  <i
                    className={
                      editingCategory
                        ? "bi bi-check-lg"
                        : "bi bi-plus-lg"
                    }
                  ></i>

                  {editingCategory
                    ? "Update Category"
                    : categoryMode === "main"
                    ? "Add Main Category"
                    : "Add Subcategory"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Categories;