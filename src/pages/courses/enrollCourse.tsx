import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import type { Course } from "../../types/course";
import { addToCart } from "../../store/slices/cart/cart";
import { Button } from "../../components/ui/button";
import toast from "react-hot-toast";

interface CourseCardProps {
  course: Course;
}

const EnrolleCourse: React.FC<CourseCardProps> = ({ course }) => {
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent parent click navigation

    // Check if course is already in cart
    const exists = cartItems.find((item) => item.id === course.id);
    if (exists) {
      toast.error("Course is already in cart");
      return;
    }

    // Add new course to cart
    dispatch(
      addToCart({
        ...course,
        quantity: 1,
      })
    );

    toast.success("Course added to cart");
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
