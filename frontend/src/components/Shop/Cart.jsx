import Navbar from "../NavBar/NavBar";
import { useCart } from "./CartContext";

const Cart = () => {
  const { cart } = useCart();

  const total = cart.reduce(
    (sum, i) => sum + i.qty * i.price,
    0
  );

  return (
    <>
      <Navbar />

      {/* OFFSET FOR FIXED NAVBAR */}
      <div className="pt-20">
        <div className="p-6 max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

          {cart.length === 0 ? (
            <p>Your cart is empty 🛒</p>
          ) : (
            <>
              {cart.map(item => (
                <div
                  key={item.id}
                  className="flex justify-between border-b py-3"
                >
                  <span>{item.name} × {item.qty}</span>
                  <span>₹{item.price * item.qty}</span>
                </div>
              ))}

              <div className="text-right font-bold mt-4">
                Total: ₹{total}
              </div>

              <button className="mt-6 bg-black text-white px-6 py-2 rounded">
                Proceed to Checkout
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
