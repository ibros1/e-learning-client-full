import { useDispatch } from "react-redux";

import type { AppDispatch } from "../../store/store";
import type { Course } from "../../types/course";
import { addToCart } from "../../store/slices/cart/cart";
import { Button } from "../../components/ui/button";

interface CourseCardProps {
  course: Course;
}

const EnrolleCourse: React.FC<CourseCardProps> = ({ course }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent parent click navigation

    const cartItem = {
      ...course,
      quantity: 1,
    };

    dispatch(addToCart(cartItem));
  };

  return (
    <div>
      <Button
        onClick={handleAddToCart}
        className="mt-2 bg-slate-900 text-white px-4 py-2 rounded hover:bg-slate-800 transition duration-300"
      >
        Add to Cart
      </Button>
    </div>
  );
};

export default EnrolleCourse;
