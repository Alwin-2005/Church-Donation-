import React, { useState } from "react";

const AdminProducts = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [products, setProducts] = useState([
    {
      _id: "PRD001",
      itemName: "Bible",
      category: "Books",
      price: 799,
      stockQuantity: 25,
      status: "visible",
      description: "Holy Bible",
    },
    {
      _id: "PRD002",
      itemName: "Cross Pendant",
      category: "Accessories",
      price: 499,
      stockQuantity: 40,
      status: "visible",
      description: "",
    },
    {
      _id: "PRD003",
      itemName: "Prayer Book",
      category: "Books",
      price: 299,
      stockQuantity: 0,
      status: "hidden",
      description: "",
    },
  ]);

  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    price: "",
    stockQuantity: "",
    status: "visible",
    description: "",
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ---------- ADD ---------- */
  const handleAddClick = () => {
    setEditingProduct(null);
    setFormData({
      itemName: "",
      category: "",
      price: "",
      stockQuantity: "",
      status: "visible",
      description: "",
    });
    setShowForm(true);
  };

  /* ---------- EDIT ---------- */
  const handleEditClick = product => {
    setEditingProduct(product);
    setFormData({
      itemName: product.itemName,
      category: product.category,
      price: product.price,
      stockQuantity: product.stockQuantity,
      status: product.status,
      description: product.description || "",
    });
    setShowForm(true);
  };

  /* ---------- SUBMIT ---------- */
  const handleSubmit = e => {
    e.preventDefault();

    if (editingProduct) {
      // UPDATE
      setProducts(products.map(p =>
        p._id === editingProduct._id
          ? {
              ...p,
              ...formData,
              price: Number(formData.price),
              stockQuantity: Number(formData.stockQuantity),
            }
          : p
      ));
    } else {
      // CREATE
      setProducts([
        ...products,
        {
          _id: `PRD${products.length + 1}`,
          ...formData,
          price: Number(formData.price),
          stockQuantity: Number(formData.stockQuantity),
        },
      ]);
    }

    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="mt-24 px-6 ">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Merchandise</h1>
        <button
          onClick={handleAddClick}
          className="bg-black text-white px-4 py-2 rounded"
        >
          + Add Product
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-x-auto animate-scaleIn ">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{p.itemName}</td>
                <td className="p-3">{p.category}</td>
                <td className="p-3">₹{p.price}</td>
                <td
                  className={`p-3 font-medium ${
                    p.stockQuantity === 0
                      ? "text-red-500"
                      : "text-green-600"
                  }`}
                >
                  {p.stockQuantity}
                </td>
                <td className="p-3 capitalize">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      p.status === "visible"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="p-3 space-x-3">
                  <button
                    onClick={() => handleEditClick(p)}
                    className="text-blue-600"
                  >
                    Edit
                  </button>
                  <button className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                placeholder="Product Name"
                className="w-full border p-2 rounded"
                required
              />

              <input
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Category"
                className="w-full border p-2 rounded"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Price"
                  className="border p-2 rounded"
                  required
                />
                <input
                  name="stockQuantity"
                  type="number"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  placeholder="Stock Quantity"
                  className="border p-2 rounded"
                  required
                />
              </div>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="visible">Visible</option>
                <option value="hidden">Hidden</option>
              </select>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description (optional)"
                className="w-full border p-2 rounded"
              />

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded"
                >
                  {editingProduct ? "Update Product" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
