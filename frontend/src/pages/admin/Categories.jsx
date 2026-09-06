
import React, { useEffect, useState } from "react";
import "./Categories.css";

const API_URL = "http://localhost:5000/api/categories";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Generate slug automatically from category name
  const generateSlug = (name) => {
    return name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();

      console.log("Categories API response:", data);

      setCategories(data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add category
  const handleAdd = async () => {
    const name = prompt("Enter category name:");

    if (!name || name.trim() === "") {
      return;
    }

    const trimmedName = name.trim();
    const slug = generateSlug(trimmedName);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          slug: slug,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add category");
      }

      alert(data.message || "Category added successfully");

      fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);
      alert(error.message);
    }
  };

  // Edit category
  const handleEdit = async (category) => {
    const newName = prompt(
      "Edit category name:",
      category.name
    );

    if (!newName || newName.trim() === "") {
      return;
    }

    const trimmedName = newName.trim();
    const slug = generateSlug(trimmedName);

    try {
      const categoryId = category._id || category.id;

      const response = await fetch(
        `${API_URL}/${categoryId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: trimmedName,
            slug: slug,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update category"
        );
      }

      alert(
        data.message || "Category updated successfully"
      );

      fetchCategories();
    } catch (error) {
      console.error("Error updating category:", error);
      alert(error.message);
    }
  };

  // Delete category
  const handleDelete = async (category) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${category.name}"?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const categoryId = category._id || category.id;

      const response = await fetch(
        `${API_URL}/${categoryId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete category"
        );
      }

      alert(
        data.message || "Category deleted successfully"
      );

      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      alert(error.message);
    }
  };

  // Search categories
  const filteredCategories = categories.filter((category) =>
    (category.name || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="categories-page">

      {/* Page Header */}
      <div className="categories-header">
        <div>
          <h1>Categories</h1>
          <p>Manage your product categories</p>
        </div>

        <button
          className="add-category-btn"
          onClick={handleAdd}
        >
          + Add Category
        </button>
      </div>

      {/* Categories Card */}
      <div className="categories-card">

        {/* Card Header */}
        <div className="categories-card-header">
          <div>
            <h2>All Categories</h2>

            <p>
              {categories.length} categories available
            </p>
          </div>

          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="category-search"
          />
        </div>

        {/* Categories Table */}
        <div className="categories-table-container">
          <table className="categories-table">

            <thead>
              <tr>
                <th>#</th>
                <th>Category</th>
                <th>Products</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="no-category"
                  >
                    Loading categories...
                  </td>
                </tr>
              ) : filteredCategories.length > 0 ? (
                filteredCategories.map((category, index) => (
                  <tr
                    key={category._id || category.id}
                  >

                    {/* Number */}
                    <td className="category-number">
                      {index + 1}
                    </td>

                    {/* Category */}
                    <td>
                      <div className="category-name">

                        <div className="category-icon">
                          {(category.name || "?")
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <strong>
                          {category.name}
                        </strong>

                      </div>
                    </td>

                    {/* Products */}
                    <td>
                      <span className="product-count">
                        {category.products ||
                          category.productCount ||
                          0}{" "}
                        Products
                      </span>
                    </td>

                    {/* Status */}
                    <td>
                      <span className="category-status">
                        Active
                      </span>
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="category-actions">

                        <button
                          className="edit-category-btn"
                          onClick={() =>
                            handleEdit(category)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="delete-category-btn"
                          onClick={() =>
                            handleDelete(category)
                          }
                        >
                          Delete
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="no-category"
                  >
                    No categories found
                  </td>
                </tr>
              )}

            </tbody>

          </table>
        </div>

      </div>
    </div>
  );
}

export default Categories;

