import { useEffect } from "react";
import { ShoppingCart, Trash2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Button } from "../ui/button";
import type { RootState } from "../../store/store";
import { removeFromCart } from "../../store/slices/cart/cart";

const CartPopup = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();

  // Save cartItems to localStorage on every change
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const handleRemove = (id: number) => {
    dispatch(removeFromCart(id));
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
    0
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          aria-label="Open cart"
        >
          <ShoppingCart className="w-6 h-6 text-gray-800 dark:text-white" />
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {cartItems.length}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-96 p-4">
        <h4 className="font-semibold text-lg mb-4 border-b pb-2">Your Cart</h4>

        {cartItems.length === 0 ? (
          <p className="text-sm text-gray-500">Your cart is empty.</p>
        ) : (
          <>
            <div className="max-h-72 overflow-y-auto space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 border-b pb-4"
                >
                  {item.course_img && (
                    <img
                      src={`${item.course_img}`}
                      alt={item.title}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-1">
                      ${(item.price ?? 0).toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-500 hover:text-red-600 transition"
                    aria-label={`Remove ${item.title} from cart`}
                    title="Remove"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t pt-4 flex justify-between items-center">
              <span className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                Total:
              </span>
              <span className="font-bold text-xl text-blue-600 dark:text-blue-400">
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            <Button
              className="w-full mt-4"
              onClick={() => {
                window.location.href = "/checkout";
              }}
            >
              Checkout
            </Button>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default CartPopup;
