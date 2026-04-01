import { ShoppingBag } from "lucide-react";

const CartButton = ({ cart }) => {
  const totalItems = cart.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  return (
    <div className="relative group">
      <button
        className="w-16 h-16 bg-foreground text-background flex items-center justify-center transition-all hover:bg-accent border border-line"
      >
        <ShoppingBag className="w-6 h-6" />

        {totalItems > 0 && (
          <span
            className="absolute -top-2 -right-2 bg-accent text-background
                       text-[10px] w-6 h-6 flex items-center
                       justify-center font-bold font-sans border border-line"
          >
            {totalItems}
          </span>
        )}
      </button>
    </div>
  );
};

export default CartButton;
