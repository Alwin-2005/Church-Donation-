import React, { useState } from "react";
import { Upload, AlertCircle } from "lucide-react";

const AdminProducts = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // DRAG DROP STATE
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");

  /* ---------- DRAG & MATCH LOGIC ---------- */
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileValidation(e.dataTransfer.files[0]);
    }
  };

  const handleFileValidation = (file) => {
    setError("");

    // Check type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (PNG, JPG, etc).");
      return;
    }

    // Read Dimensions
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        if (img.width < 500 || img.height < 500) {
          setError(`Image is too small (${img.width}x${img.height}). Min size is 500x500.`);
        } else {
          // Success - mimic upload by setting data URL as the "url"
          setFormData(prev => ({ ...prev, url: reader.result }));
        }
      };
    };
  };

  /* ---------- MOCK DATA ---------- */
  const [products, setProducts] = useState([
    {
      _id: "PRD001",
      url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop",
      itemName: "Holy Bible",
      category: "Books",
      price: 799,
      stockQuantity: 25,
      status: "visible",
      description: "Standard edition holy bible.",
    },
    {
      _id: "PRD002",
      url: "https://images.unsplash.com/photo-1576774659427-0c58b52f6f4e?q=80&w=800&auto=format&fit=crop",
      itemName: "Cross Pendant",
      category: "Accessories",
      price: 499,
      stockQuantity: 40,
      status: "visible",
      description: "Silver cross pendant.",
    },
    {
      _id: "PRD003",
      url: "",
      itemName: "Prayer Book",
      category: "Books",
      price: 299,
      stockQuantity: 0,
      status: "hidden",
      description: "Out of stock item.",
    },
  ]);

  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    price: "",
    stockQuantity: "",
    status: "visible",
    description: "",
    url: "",
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
      url: "",
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
      url: product.url || "",
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
    <div className="mt-24 px-6 mb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Merchandise</h1>
          <p className="text-gray-500 mt-1">Manage shop products and inventory</p>
        </div>
        <button
          onClick={handleAddClick}
          className="bg-black hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all font-medium flex items-center gap-2"
        >
          <span>+</span> Add Product
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden animate-scaleIn">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider text-xs">
              <tr>
                <th className="p-4 font-semibold">Image</th>
                <th className="p-4 font-semibold">Product Info</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Stock</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map(p => (
                <tr key={p._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="p-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                      {p.url ? (
                        <img src={p.url} alt={p.itemName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-gray-900">{p.itemName}</p>
                    <p className="text-xs text-gray-500 truncate max-w-[150px]">{p._id}</p>
                  </td>
                  <td className="p-4 text-gray-600">
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">{p.category}</span>
                  </td>
                  <td className="p-4 font-medium text-gray-900">₹{p.price}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${p.stockQuantity > 0 ? "bg-emerald-500" : "bg-red-500"}`} />
                      <span className={p.stockQuantity === 0 ? "text-red-600 font-medium" : "text-gray-700"}>
                        {p.stockQuantity}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${p.status === "visible"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        : "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditClick(p)}
                        className="text-gray-500 hover:text-black p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        Edit
                      </button>
                      <button
                        className="text-gray-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden scale-100 animate-scaleIn">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-black transition-colors">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Product Image</label>

                  {formData.url ? (
                    <div className="relative w-full h-48 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 overflow-hidden group">
                      <img src={formData.url} alt="Preview" className="w-full h-full object-contain" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, url: "" })}
                          className="bg-white text-red-600 px-4 py-2 rounded-lg font-bold shadow-lg hover:bg-red-50 transition-colors"
                        >
                          Remove Image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      className={`relative w-full h-48 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer ${dragActive
                        ? "border-black bg-gray-50 scale-[1.02]"
                        : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                        }`}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileValidation(e.target.files[0])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex flex-col items-center text-center p-4 space-y-3 pointer-events-none">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <Upload className="w-6 h-6 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            SVG, PNG, JPG or GIF (min. 500x500px)
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {error && (
                    <div className="mt-2 flex items-center gap-2 text-red-500 text-xs font-medium animate-pulse">
                      <AlertCircle className="w-4 h-4" />
                      <span>{error}</span>
                    </div>
                  )}
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Product Name</label>
                  <input
                    name="itemName"
                    value={formData.itemName}
                    onChange={handleChange}
                    placeholder="e.g. Holy Bible"
                    className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all text-sm font-medium"
                    required
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Category</label>
                  <input
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="e.g. Books"
                    className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Price (₹)</label>
                  <input
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Stock</label>
                  <input
                    name="stockQuantity"
                    type="number"
                    value={formData.stockQuantity}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all text-sm bg-white"
                >
                  <option value="visible">Visible</option>
                  <option value="hidden">Hidden</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Product details..."
                  className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-all text-sm min-h-[80px]"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-black text-white rounded-lg hover:bg-gray-900 font-bold text-sm shadow-md transition-transform active:scale-95"
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
