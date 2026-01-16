const AdminProducts = () => {
  const products = [
    { id: 1, name: "Bible", price: 799, stock: 25 },
    { id: 2, name: "Cross Pendant", price: 499, stock: 40 },
    { id: 3, name: "Prayer Book", price: 299, stock: 0 },
  ];

  return (
    <div className="mt-24 px-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Products</h1>
        <button className="bg-black text-white px-4 py-2 rounded">
          + Add Product
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-sm">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-t text-sm">
                <td className="p-3">{p.name}</td>
                <td className="p-3">₹{p.price}</td>
                <td className={`p-3 ${p.stock === 0 ? "text-red-500" : ""}`}>
                  {p.stock}
                </td>
                <td className="p-3 space-x-3">
                  <button className="text-blue-600">Edit</button>
                  <button className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
