const CartButton = ({ cart }) => {
  const totalItems = cart.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  return (
    <button
      className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700
                 text-white w-16 h-16 rounded-full shadow-lg
                 flex items-center justify-center text-2xl"
    >
      🛒

      {totalItems > 0 && (
        <span
          className="absolute -top-1 -right-1 bg-red-600 text-white
                     text-xs w-6 h-6 rounded-full flex items-center
                     justify-center font-bold"
        >
          {totalItems}
        </span>
      )}
    </button>
  );
};

export default CartButton;
