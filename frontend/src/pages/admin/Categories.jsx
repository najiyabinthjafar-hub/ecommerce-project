import React, { useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import "./Categories.css";

const initialCategories = [
  { id: 1, name: "Men", products: 24 },
  { id: 2, name: "Women", products: 32 },
  { id: 3, name: "Kids", products: 18 },
  { id: 4, name: "Footwear", products: 15 },
  { id: 5, name: "Bags", products: 12 },
  { id: 6, name: "Accessories", products: 20 },
];

function Categories() {
  const [categories, setCategories] = useState(initialCategories);
  const [search, setSearch] = useState("");

  const handleDelete = (id) => {
    setCategories(
      categories.filter((category) => category.id !== id)
    );
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <AdminSidebar />

      <div className="categories-page">
        <div className="categories-content">

          {/* Page Header */}
          <div className="categories-header">
            <div>
              <h1>Categories</h1>
              <p>Manage your product categories</p>
            </div>

            <button
  className="add-category-btn"
  onClick={() => {
    const name = prompt("Enter category name:");

    if (name && name.trim() !== "") {
      setCategories([
        ...categories,
        {
          id: Date.now(),
          name: name.trim(),
          products: 0,
        },
      ]);
    }
  }}
>
  + Add Category
</button>
          </div>

          {/* Category Card */}
          <div className="categories-card">

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

            {/* Table */}
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
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((category, index) => (
                      <tr key={category.id}>

                        <td className="category-number">
                          {index + 1}
                        </td>

                        <td>
                          <div className="category-name">
                            <div className="category-icon">
                              {category.name.charAt(0)}
                            </div>

                            <strong>{category.name}</strong>
                          </div>
                        </td>

                        <td>
                          <span className="product-count">
                            {category.products} Products
                          </span>
                        </td>

                        <td>
                          <span className="category-status">
                            Active
                          </span>
                        </td>

                        <td>
                          <div className="category-actions">

                            <button
  className="edit-category-btn"
  onClick={() => {
    const newName = prompt(
      "Edit category name:",
      category.name
    );

    if (newName && newName.trim() !== "") {
      setCategories(
        categories.map((item) =>
          item.id === category.id
            ? {
                ...item,
                name: newName.trim(),
              }
            : item
        )
      );
    }
  }}
>
  Edit
</button>

                            <button
                              className="delete-category-btn"
                              onClick={() =>
                                handleDelete(category.id)
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
      </div>
    </>
  );
}

export default Categories;