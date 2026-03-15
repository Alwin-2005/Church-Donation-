const CartButton = ({ cart }) => {
  const totalItems = cart.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  return (
    <button
      className="relative bg-primary hover:bg-primary/90
                 text-primary-foreground w-16 h-16 rounded-full shadow-lg
                 flex items-center justify-center text-2xl"
    >
      🛒

      {totalItems > 0 && (
        <span
          className="absolute -top-1 -right-1 bg-destructive text-primary-foreground
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
