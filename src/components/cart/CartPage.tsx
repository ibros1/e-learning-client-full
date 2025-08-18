import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store/store";
import { removeFromCart } from "../../store/slices/cart/cart";

export const CartPage = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();

  const handleRemove = (id: number) => {
    dispatch(removeFromCart(id));
  };

  return (
    <div>
      <h1>Cart Page</h1>
      {cartItems.map((item) => (
        <div key={item.id}>
          <p>
            {item.title} x {item.quantity}
          </p>
          <button onClick={() => handleRemove(item.id)}>Remove</button>
        </div>
      ))}
    </div>
  );
};
